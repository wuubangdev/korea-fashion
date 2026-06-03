package com.shope.kf.infrastructure.chatbot;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shope.kf.infrastructure.api.dto.request.ChatbotMessageRequest;
import com.shope.kf.infrastructure.api.dto.request.ChatbotSessionRequest;
import com.shope.kf.infrastructure.api.dto.response.ChatbotMessageResponse;
import com.shope.kf.infrastructure.api.dto.response.ChatbotSessionResponse;
import com.shope.kf.infrastructure.api.dto.response.ChatbotStoredMessageResponse;
import com.shope.kf.infrastructure.exception.AppException;
import com.shope.kf.infrastructure.exception.ErrorCode;
import com.shope.kf.infrastructure.persistence.jpa.CategoryJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.ChatMessageJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.ChatSessionJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.ProductJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.UserJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.CategoryJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.ChatMessageJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.ChatSessionJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.ProductJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.UserJpaRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.text.NumberFormat;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ChatbotService {
    private static final int MAX_PRODUCTS = 60;
    private static final int MAX_HISTORY_ITEMS = 8;
    private static final int MAX_SESSIONS = 20;
    private static final String GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent";
    private static final String ROLE_USER = "user";
    private static final String ROLE_MODEL = "model";
    private static final String DEFAULT_TITLE = "Chat tu van san pham";
    private static final TypeReference<List<ChatbotMessageResponse.ProductSuggestion>> SUGGESTIONS_TYPE = new TypeReference<>() {
    };

    private final ProductJpaRepository productRepository;
    private final CategoryJpaRepository categoryRepository;
    private final ChatSessionJpaRepository sessionRepository;
    private final ChatMessageJpaRepository messageRepository;
    private final UserJpaRepository userRepository;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final String apiKey;
    private final String model;
    private final int hourlyLimit;
    private final int dailyLimit;

    public ChatbotService(
            ProductJpaRepository productRepository,
            CategoryJpaRepository categoryRepository,
            ChatSessionJpaRepository sessionRepository,
            ChatMessageJpaRepository messageRepository,
            UserJpaRepository userRepository,
            @Value("${gemini.api-key:}") String apiKey,
            @Value("${gemini.model:gemini-3.5-flash}") String model,
            @Value("${chatbot.rate-limit.hourly:20}") int hourlyLimit,
            @Value("${chatbot.rate-limit.daily:80}") int dailyLimit
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.sessionRepository = sessionRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.objectMapper = new ObjectMapper();
        this.apiKey = apiKey;
        this.model = model;
        this.hourlyLimit = hourlyLimit;
        this.dailyLimit = dailyLimit;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    @Transactional(readOnly = true)
    public List<ChatbotSessionResponse> sessions(Authentication authentication, String clientSessionId) {
        ChatIdentity identity = resolveIdentity(authentication, clientSessionId, null);
        List<ChatSessionJpaEntity> sessions = identity.username() != null
                ? sessionRepository.findByUserUsernameAndDeletedAtIsNullOrderByUpdatedAtDesc(identity.username(), PageRequest.of(0, MAX_SESSIONS))
                : sessionRepository.findByClientSessionIdAndDeletedAtIsNullOrderByUpdatedAtDesc(identity.clientSessionId(), PageRequest.of(0, MAX_SESSIONS));
        return sessions.stream().map(this::toSessionResponse).toList();
    }

    @Transactional
    public ChatbotSessionResponse createSession(ChatbotSessionRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        ChatIdentity identity = resolveIdentity(authentication, request == null ? null : request.clientSessionId(), httpRequest);
        ChatSessionJpaEntity session = new ChatSessionJpaEntity();
        session.setTitle(DEFAULT_TITLE);
        applyOwner(session, identity);
        return toSessionResponse(sessionRepository.save(session));
    }

    @Transactional(readOnly = true)
    public List<ChatbotStoredMessageResponse> messages(Long sessionId, Authentication authentication, String clientSessionId) {
        ChatIdentity identity = resolveIdentity(authentication, clientSessionId, null);
        ChatSessionJpaEntity session = findOwnedSession(sessionId, identity);
        return messageRepository.findBySessionIdAndDeletedAtIsNullOrderByCreatedAtAsc(session.getId()).stream()
                .map(this::toStoredMessageResponse)
                .toList();
    }

    @Transactional
    public void deleteSession(Long sessionId, Authentication authentication, String clientSessionId) {
        ChatIdentity identity = resolveIdentity(authentication, clientSessionId, null);
        ChatSessionJpaEntity session = findOwnedSession(sessionId, identity);
        String actor = identity.username() == null ? "guest:" + identity.clientSessionId() : identity.username();
        messageRepository.findBySessionIdAndDeletedAtIsNullOrderByCreatedAtAsc(session.getId())
                .forEach(message -> message.markDeleted(actor));
        session.markDeleted(actor);
    }

    @Transactional
    public ChatbotMessageResponse chat(ChatbotMessageRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        ChatIdentity identity = resolveIdentity(authentication, request.clientSessionId(), httpRequest);
        enforceRateLimit(identity);

        ChatSessionJpaEntity session = request.sessionId() == null
                ? createOwnedSession(identity)
                : findOwnedSession(request.sessionId(), identity);

        String messageText = request.message().trim();
        updateTitleIfNeeded(session, messageText);
        saveMessage(session, ROLE_USER, messageText, List.of());

        boolean inScope = isShoppingAdvice(messageText);
        boolean suggestProducts = inScope && shouldSuggestProducts(messageText);
        List<ProductContext> products = inScope ? loadProducts() : List.of();
        List<ChatbotMessageResponse.ProductSuggestion> suggestions = suggestProducts ? suggestProducts(messageText, products) : List.of();
        String answer = answer(messageText, session, products, suggestions, inScope);
        saveMessage(session, ROLE_MODEL, answer, suggestions);

        int remaining = Math.max(0, dailyLimit - (int) countSince(identity, Instant.now().minus(Duration.ofDays(1))));
        return new ChatbotMessageResponse(session.getId(), answer, suggestions, remaining);
    }

    private String answer(
            String messageText,
            ChatSessionJpaEntity session,
            List<ProductContext> products,
            List<ChatbotMessageResponse.ProductSuggestion> suggestions,
            boolean inScope
    ) {
        if (!inScope) {
            return "M\u00ecnh ch\u1ec9 h\u1ed7 tr\u1ee3 t\u01b0 v\u1ea5n th\u1eddi trang v\u00e0 mua s\u1eafm t\u1ea1i Korea Fashion. C\u00e2u n\u00e0y n\u1eb1m ngo\u00e0i ph\u1ea1m vi h\u1ed7 tr\u1ee3, n\u00ean m\u00ecnh kh\u00f4ng th\u1ec3 tr\u1ea3 l\u1eddi chi ti\u1ebft. B\u1ea1n c\u00f3 th\u1ec3 h\u1ecfi m\u00ecnh v\u1ec1 item, phong c\u00e1ch, size, gi\u00e1 ho\u1eb7c nh\u00e3n hi\u1ec7u mu\u1ed1n t\u00ecm nh\u00e9.";
        }
        if (!StringUtils.hasText(apiKey)) {
            return "Chatbot ch\u01b0a \u0111\u01b0\u1ee3c c\u1ea5u h\u00ecnh Gemini API key. B\u1ea1n v\u1eabn c\u00f3 th\u1ec3 xem c\u00e1c s\u1ea3n ph\u1ea9m g\u1ee3i \u00fd b\u00ean d\u01b0\u1edbi.";
        }

        try {
            return callGemini(messageText, session.getId(), products);
        } catch (Exception ex) {
            if (!suggestions.isEmpty()) {
                return "Hi\u1ec7n t\u1ea1i tr\u1ee3 l\u00fd \u0111ang b\u1eadn. M\u00ecnh \u0111\u00e3 g\u1ee3i \u00fd m\u1ed9t v\u00e0i s\u1ea3n ph\u1ea9m ph\u00f9 h\u1ee3p b\u00ean d\u01b0\u1edbi, b\u1ea1n tham kh\u1ea3o tr\u01b0\u1edbc nh\u00e9.";
            }
            return "Hi\u1ec7n t\u1ea1i tr\u1ee3 l\u00fd \u0111ang b\u1eadn. B\u1ea1n th\u1eed h\u1ecfi l\u1ea1i sau \u00edt ph\u00fat ho\u1eb7c d\u00f9ng \u00f4 t\u00ecm ki\u1ebfm s\u1ea3n ph\u1ea9m nh\u00e9.";
        }
    }

    private void enforceRateLimit(ChatIdentity identity) {
        Instant now = Instant.now();
        long hourlyCount = countSince(identity, now.minus(Duration.ofHours(1)));
        if (hourlyCount >= hourlyLimit) {
            throw new AppException(ErrorCode.RATE_LIMIT, "Ban da chat qua nhieu trong 1 gio. Vui long thu lai sau.");
        }
        long dailyCount = countSince(identity, now.minus(Duration.ofDays(1)));
        if (dailyCount >= dailyLimit) {
            throw new AppException(ErrorCode.RATE_LIMIT, "Ban da dat gioi han chat trong ngay. Vui long quay lai sau.");
        }
    }

    private long countSince(ChatIdentity identity, Instant since) {
        return identity.username() != null
                ? messageRepository.countUserMessagesSince(identity.username(), since)
                : messageRepository.countGuestMessagesSince(identity.clientSessionId(), since);
    }

    private ChatSessionJpaEntity createOwnedSession(ChatIdentity identity) {
        ChatSessionJpaEntity session = new ChatSessionJpaEntity();
        session.setTitle(DEFAULT_TITLE);
        applyOwner(session, identity);
        return sessionRepository.save(session);
    }

    private void applyOwner(ChatSessionJpaEntity session, ChatIdentity identity) {
        if (identity.username() != null) {
            UserJpaEntity user = userRepository.findByUsername(identity.username())
                    .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED, "Login required"));
            session.setUser(user);
            session.setClientSessionId(null);
            return;
        }
        session.setClientSessionId(identity.clientSessionId());
    }

    private ChatSessionJpaEntity findOwnedSession(Long sessionId, ChatIdentity identity) {
        if (sessionId == null) {
            throw new AppException(ErrorCode.NOT_FOUND, "Chat session not found");
        }
        return identity.username() != null
                ? sessionRepository.findByIdAndUserUsernameAndDeletedAtIsNull(sessionId, identity.username())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Chat session not found"))
                : sessionRepository.findByIdAndClientSessionIdAndDeletedAtIsNull(sessionId, identity.clientSessionId())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Chat session not found"));
    }

    private ChatIdentity resolveIdentity(Authentication authentication, String clientSessionId, HttpServletRequest request) {
        if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof String username && StringUtils.hasText(username)) {
            return new ChatIdentity(username, null);
        }
        String normalized = StringUtils.hasText(clientSessionId) ? clientSessionId.trim() : null;
        if (!StringUtils.hasText(normalized) && request != null) {
            normalized = request.getRemoteAddr();
        }
        if (!StringUtils.hasText(normalized)) {
            throw new AppException(ErrorCode.BAD_REQUEST, "clientSessionId is required for guest chat");
        }
        if (normalized.length() > 80) {
            normalized = normalized.substring(0, 80);
        }
        return new ChatIdentity(null, normalized);
    }

    private void updateTitleIfNeeded(ChatSessionJpaEntity session, String messageText) {
        if (!DEFAULT_TITLE.equals(session.getTitle())) {
            return;
        }
        String title = messageText.replaceAll("\\s+", " ").trim();
        if (title.length() > 60) {
            title = title.substring(0, 57) + "...";
        }
        session.setTitle(StringUtils.hasText(title) ? title : DEFAULT_TITLE);
    }

    private void saveMessage(ChatSessionJpaEntity session, String role, String content, List<ChatbotMessageResponse.ProductSuggestion> suggestions) {
        ChatMessageJpaEntity message = new ChatMessageJpaEntity();
        message.setSession(session);
        message.setRole(role);
        message.setContent(content);
        if (suggestions != null && !suggestions.isEmpty()) {
            try {
                message.setSuggestionsJson(objectMapper.writeValueAsString(suggestions));
            } catch (IOException ignored) {
                message.setSuggestionsJson(null);
            }
        }
        messageRepository.save(message);
    }

    private List<ProductContext> loadProducts() {
        Specification<ProductJpaEntity> activeProducts = (root, query, cb) -> cb.or(
                cb.isNull(root.get("status")),
                cb.equal(cb.lower(root.get("status")), "active")
        );
        var page = productRepository.findAll(activeProducts, PageRequest.of(0, MAX_PRODUCTS, Sort.by(Sort.Direction.DESC, "id")));
        Map<Long, CategoryJpaEntity> categoriesById = categoryRepository.findAllById(
                page.getContent().stream()
                        .map(ProductJpaEntity::getCategoryId)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toSet())
        ).stream().collect(Collectors.toMap(CategoryJpaEntity::getId, Function.identity()));

        return page.getContent().stream()
                .map(product -> ProductContext.from(product, categoriesById.get(product.getCategoryId())))
                .toList();
    }

    private String callGemini(String messageText, Long sessionId, List<ProductContext> products) throws IOException, InterruptedException {
        Map<String, Object> payload = Map.of(
                "system_instruction", content(systemInstruction(products)),
                "contents", contents(sessionId, messageText),
                "generationConfig", Map.of(
                        "temperature", 0.45,
                        "maxOutputTokens", 600
                )
        );
        String body = objectMapper.writeValueAsString(payload);
        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(GEMINI_ENDPOINT.formatted(model)))
                .timeout(Duration.ofSeconds(20))
                .header(HttpHeaders.CONTENT_TYPE, "application/json")
                .header("x-goog-api-key", apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();
        HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new IOException("Gemini API returned status " + response.statusCode());
        }
        return extractGeminiText(response.body());
    }

    private String systemInstruction(List<ProductContext> products) {
        return """
                B\u1ea1n l\u00e0 tr\u1ee3 l\u00fd kh\u00e1ch h\u00e0ng c\u1ee7a Korea Fashion.
                Ch\u1ec9 tr\u1ea3 l\u1eddi trong ph\u1ea1m vi t\u01b0 v\u1ea5n mua s\u1eafm th\u1eddi trang: t\u00ecm ki\u1ebfm s\u1ea3n ph\u1ea9m, t\u01b0 v\u1ea5n ph\u1ed1i \u0111\u1ed3, ch\u1ecdn size/phong c\u00e1ch c\u01a1 b\u1ea3n, nh\u00e3n hi\u1ec7u, danh m\u1ee5c, gi\u00e1 ti\u1ec1n, t\u1ed3n kho c\u01a1 b\u1ea3n, th\u1eddi gian h\u1ed7 tr\u1ee3/giao h\u00e0ng n\u1ebfu c\u00f3 trong ng\u1eef c\u1ea3nh.
                N\u1ebfu kh\u00e1ch h\u1ecfi ngo\u00e0i ph\u1ea1m vi n\u00e0y, t\u1eeb ch\u1ed1i ng\u1eafn g\u1ecdn v\u00e0 h\u01b0\u1edbng h\u1ecd quay l\u1ea1i nhu c\u1ea7u mua s\u1eafm th\u1eddi trang.
                Kh\u00f4ng vi\u1ebft code, kh\u00f4ng l\u00e0m b\u00e0i t\u1eadp, kh\u00f4ng t\u01b0 v\u1ea5n ph\u00e1p l\u00fd/y t\u1ebf/t\u00e0i ch\u00ednh, kh\u00f4ng t\u1ea1o n\u1ed9i dung ngo\u00e0i mua s\u1eafm.
                Kh\u00f4ng b\u1ecba s\u1ea3n ph\u1ea9m, gi\u00e1, danh m\u1ee5c ho\u1eb7c khuy\u1ebfn m\u00e3i. Ch\u1ec9 d\u00f9ng danh s\u00e1ch s\u1ea3n ph\u1ea9m b\u00ean d\u01b0\u1edbi.
                H\u00e3y t\u01b0 v\u1ea5n nh\u01b0 nh\u00e2n vi\u00ean b\u00e1n h\u00e0ng tinh t\u1ebf: h\u1ecfi l\u1ea1i khi thi\u1ebfu size, ng\u00e2n s\u00e1ch, d\u1ecbp m\u1eb7c ho\u1eb7c gu m\u00e0u; n\u1ebfu \u0111\u1ee7 th\u00f4ng tin th\u00ec g\u1ee3i \u00fd 2-4 l\u1ef1a ch\u1ecdn c\u00f3 l\u00fd do ng\u1eafn.
                Kh\u00f4ng \u00e9p li\u1ec7t k\u00ea s\u1ea3n ph\u1ea9m khi kh\u00e1ch ch\u1ec9 ch\u00e0o h\u1ecfi ho\u1eb7c h\u1ecfi chung. Tr\u1ea3 l\u1eddi t\u1ef1 nhi\u00ean, ng\u1eafn g\u1ecdn, c\u00f3 th\u1ec3 g\u1ee3i m\u1edf b\u1eb1ng m\u1ed9t c\u00e2u h\u1ecfi ph\u00f9 h\u1ee3p.

                Danh s\u00e1ch s\u1ea3n ph\u1ea9m hi\u1ec7n c\u00f3:
                %s
                """.formatted(productContextText(products));
    }

    private String productContextText(List<ProductContext> products) {
        if (products.isEmpty()) {
            return "- Ch\u01b0a c\u00f3 s\u1ea3n ph\u1ea9m active trong h\u1ec7 th\u1ed1ng.";
        }
        return products.stream()
                .map(product -> "- ID %s | %s | thuong hieu: %s | danh muc: %s | gia: %s | ton kho: %s | URL: %s"
                        .formatted(
                                product.id(),
                                product.name(),
                                fallback(product.brand(), "Khong ro"),
                                fallback(product.category(), "Khong ro"),
                                product.price(),
                                product.stockQuantity() == null ? "Khong ro" : product.stockQuantity(),
                                product.url()
                        ))
                .collect(Collectors.joining("\n"));
    }

    private List<Map<String, Object>> contents(Long sessionId, String messageText) {
        List<Map<String, Object>> contents = new ArrayList<>();
        List<ChatMessageJpaEntity> history = messageRepository.findBySessionIdAndDeletedAtIsNullOrderByCreatedAtDesc(
                        sessionId,
                        PageRequest.of(0, MAX_HISTORY_ITEMS, Sort.by(Sort.Direction.DESC, "createdAt"))
                ).stream()
                .sorted(Comparator.comparing(ChatMessageJpaEntity::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())))
                .toList();

        for (ChatMessageJpaEntity item : history) {
            if (StringUtils.hasText(item.getContent())) {
                contents.add(contentWithRole(normalizeRole(item.getRole()), item.getContent()));
            }
        }
        if (history.stream().noneMatch(item -> ROLE_USER.equals(item.getRole()) && messageText.equals(item.getContent()))) {
            contents.add(contentWithRole(ROLE_USER, messageText));
        }
        return contents;
    }

    private Map<String, Object> content(String text) {
        return Map.of("parts", List.of(Map.of("text", text)));
    }

    private Map<String, Object> contentWithRole(String role, String text) {
        return Map.of("role", role, "parts", List.of(Map.of("text", text)));
    }

    private String normalizeRole(String role) {
        return ROLE_MODEL.equalsIgnoreCase(role) ? ROLE_MODEL : ROLE_USER;
    }

    private String extractGeminiText(String responseBody) throws IOException {
        JsonNode root = objectMapper.readTree(responseBody);
        JsonNode parts = root.path("candidates").path(0).path("content").path("parts");
        if (!parts.isArray() || parts.isEmpty()) {
            return "M\u00ecnh ch\u01b0a c\u00f3 c\u00e2u tr\u1ea3 l\u1eddi ph\u00f9 h\u1ee3p. B\u1ea1n c\u00f3 th\u1ec3 n\u00f3i r\u00f5 h\u01a1n v\u1ec1 lo\u1ea1i s\u1ea3n ph\u1ea9m, ng\u00e2n s\u00e1ch ho\u1eb7c th\u01b0\u01a1ng hi\u1ec7u b\u1ea1n mu\u1ed1n t\u00ecm kh\u00f4ng?";
        }
        String text = parts.findValues("text").stream()
                .map(JsonNode::asText)
                .filter(StringUtils::hasText)
                .collect(Collectors.joining("\n"))
                .trim();
        return StringUtils.hasText(text) ? text : "M\u00ecnh ch\u01b0a c\u00f3 c\u00e2u tr\u1ea3 l\u1eddi ph\u00f9 h\u1ee3p. B\u1ea1n c\u00f3 th\u1ec3 h\u1ecfi c\u1ee5 th\u1ec3 h\u01a1n v\u1ec1 s\u1ea3n ph\u1ea9m c\u1ea7n t\u00ecm kh\u00f4ng?";
    }

    private boolean isShoppingAdvice(String value) {
        Set<String> tokens = tokenize(value);
        Set<String> allow = Set.of(
                "ao", "quan", "vay", "dam", "chan", "phoi", "do", "mac", "size", "chat", "lieu",
                "gia", "tien", "re", "dat", "duoi", "tren", "mua", "hang", "san", "pham", "brand",
                "thuong", "hieu", "danh", "muc", "thoi", "trang", "han", "korea", "basic", "dep",
                "di", "choi", "cong", "so", "du", "lich", "sale", "khuyen", "mai", "giao", "ship",
                "ton", "kho", "tim", "kiem", "goi", "y", "tu", "van", "xin", "chao", "hello", "hi",
                "shop", "minh", "can", "muon", "hop", "voi", "style", "outfit", "form", "mau",
                "gio", "lam", "viec", "mo", "cua", "dong", "bao", "lau", "doi", "tra", "hoan"
        );
        return tokens.isEmpty() || tokens.stream().anyMatch(allow::contains);
    }

    private boolean shouldSuggestProducts(String value) {
        Set<String> tokens = tokenize(value);
        if (tokens.isEmpty()) {
            return false;
        }
        Set<String> intent = Set.of(
                "ao", "quan", "vay", "dam", "chan", "set", "size", "gia", "tien", "re", "dat",
                "duoi", "tren", "mua", "hang", "san", "pham", "brand", "thuong", "hieu", "danh",
                "muc", "basic", "cong", "so", "du", "lich", "sale", "ton", "kho", "tim", "kiem",
                "goi", "y", "tu", "van", "phoi", "mac", "outfit", "style", "form", "mau"
        );
        return tokens.stream().anyMatch(intent::contains);
    }

    private List<ChatbotMessageResponse.ProductSuggestion> suggestProducts(String message, List<ProductContext> products) {
        Set<String> tokens = tokenize(message);
        return products.stream()
                .sorted(Comparator.comparingInt((ProductContext product) -> score(product, tokens)).reversed())
                .filter(product -> tokens.isEmpty() || score(product, tokens) > 0)
                .limit(4)
                .map(product -> new ChatbotMessageResponse.ProductSuggestion(
                        product.id(),
                        product.name(),
                        product.brand(),
                        product.category(),
                        product.price(),
                        product.url()
                ))
                .toList();
    }

    private int score(ProductContext product, Set<String> tokens) {
        String haystack = String.join(" ",
                fallback(product.name(), ""),
                fallback(product.brand(), ""),
                fallback(product.category(), ""),
                fallback(product.tags(), "")
        ).toLowerCase(Locale.ROOT);
        return (int) tokens.stream().filter(haystack::contains).count();
    }

    private Set<String> tokenize(String value) {
        if (!StringUtils.hasText(value)) {
            return Set.of();
        }
        Set<String> tokens = new LinkedHashSet<>();
        String normalized = java.text.Normalizer.normalize(value.toLowerCase(Locale.ROOT), java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replace('đ', 'd');
        for (String token : normalized.split("[^\\p{L}\\p{N}]+")) {
            if (token.length() >= 1) {
                tokens.add(token);
            }
        }
        return tokens;
    }

    private String fallback(String value, String fallback) {
        return StringUtils.hasText(value) ? value.trim() : fallback;
    }

    private ChatbotSessionResponse toSessionResponse(ChatSessionJpaEntity session) {
        return new ChatbotSessionResponse(session.getId(), session.getTitle(), session.getCreatedAt(), session.getUpdatedAt());
    }

    private ChatbotStoredMessageResponse toStoredMessageResponse(ChatMessageJpaEntity message) {
        return new ChatbotStoredMessageResponse(
                message.getId(),
                message.getRole(),
                message.getContent(),
                parseSuggestions(message.getSuggestionsJson()),
                message.getCreatedAt()
        );
    }

    private List<ChatbotMessageResponse.ProductSuggestion> parseSuggestions(String value) {
        if (!StringUtils.hasText(value)) {
            return List.of();
        }
        try {
            return objectMapper.readValue(value, SUGGESTIONS_TYPE);
        } catch (IOException ex) {
            return List.of();
        }
    }

    private record ChatIdentity(String username, String clientSessionId) {
    }

    private record ProductContext(
            Long id,
            String name,
            String brand,
            String category,
            String price,
            Integer stockQuantity,
            String tags,
            String url
    ) {
        static ProductContext from(ProductJpaEntity product, CategoryJpaEntity category) {
            return new ProductContext(
                    product.getId(),
                    product.getName(),
                    product.getBrand(),
                    category == null ? null : category.getName(),
                    formatMoney(product.getPrice()),
                    product.getStockQuantity(),
                    product.getTags(),
                    "/products/" + (StringUtils.hasText(product.getSlug()) ? product.getSlug() : product.getId())
            );
        }

        private static String formatMoney(BigDecimal value) {
            if (value == null) {
                return "Li\u00ean h\u1ec7";
            }
            return NumberFormat.getCurrencyInstance(Locale.forLanguageTag("vi-VN")).format(value);
        }
    }
}
