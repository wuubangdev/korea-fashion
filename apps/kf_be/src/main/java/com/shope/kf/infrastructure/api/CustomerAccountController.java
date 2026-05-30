package com.shope.kf.infrastructure.api;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.infrastructure.api.dto.response.ApiResponse;
import com.shope.kf.infrastructure.api.dto.response.OrderResponse;
import com.shope.kf.infrastructure.api.dto.response.ProductResponse;
import com.shope.kf.infrastructure.api.dto.response.UserResponse;
import com.shope.kf.infrastructure.api.mapper.OrderApiMapper;
import com.shope.kf.infrastructure.api.mapper.ProductApiMapper;
import com.shope.kf.infrastructure.api.mapper.UserApiMapper;
import com.shope.kf.infrastructure.exception.AppException;
import com.shope.kf.infrastructure.exception.ErrorCode;
import com.shope.kf.infrastructure.persistence.jpa.PaymentJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.ProductJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.ReviewJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.ReviewImageJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.UserJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.WishlistItemJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.mapper.OrderMapper;
import com.shope.kf.infrastructure.persistence.jpa.mapper.PageMapper;
import com.shope.kf.infrastructure.persistence.jpa.mapper.ProductMapper;
import com.shope.kf.infrastructure.persistence.repository.OrderJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.PaymentJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.ProductJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.ReviewJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.ReviewImageJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.UserJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.WishlistItemJpaRepository;
import com.shope.kf.infrastructure.security.RequireAuth;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RequireAuth
@RestController
@RequestMapping("/api/me")
public class CustomerAccountController {
    private final OrderJpaRepository orderRepository;
    private final PaymentJpaRepository paymentRepository;
    private final ProductJpaRepository productRepository;
    private final ReviewJpaRepository reviewRepository;
    private final ReviewImageJpaRepository reviewImageRepository;
    private final UserJpaRepository userRepository;
    private final WishlistItemJpaRepository wishlistRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerAccountController(
            OrderJpaRepository orderRepository,
            PaymentJpaRepository paymentRepository,
            ProductJpaRepository productRepository,
            ReviewJpaRepository reviewRepository,
            ReviewImageJpaRepository reviewImageRepository,
            UserJpaRepository userRepository,
            WishlistItemJpaRepository wishlistRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.productRepository = productRepository;
        this.reviewRepository = reviewRepository;
        this.reviewImageRepository = reviewImageRepository;
        this.userRepository = userRepository;
        this.wishlistRepository = wishlistRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/profile")
    @Transactional(readOnly = true)
    public ResponseEntity<UserResponse> profile(Authentication authentication) {
        return ResponseEntity.ok(UserApiMapper.toResponse(com.shope.kf.infrastructure.persistence.jpa.mapper.UserMapper.toDomain(currentUser(authentication))));
    }

    @PostMapping("/profile")
    @Transactional
    public ResponseEntity<UserResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        UserJpaEntity user = currentUser(authentication);
        user.setEmail(blankToNull(request.email()));
        user.setFullName(blankToNull(request.fullName()));
        user.setPhone(blankToNull(request.phone()));
        user.setAddress(blankToNull(request.address()));
        user.setCity(blankToNull(request.city()));
        user.setDistrict(blankToNull(request.district()));
        user.setWard(blankToNull(request.ward()));
        user.setAvatarUrl(blankToNull(request.avatarUrl()));
        UserJpaEntity saved = userRepository.save(user);
        return ResponseEntity.ok(UserApiMapper.toResponse(com.shope.kf.infrastructure.persistence.jpa.mapper.UserMapper.toDomain(saved)));
    }

    @PostMapping("/password")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        UserJpaEntity user = currentUser(authentication);
        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.ok("Password changed", null));
    }

    @GetMapping("/wishlist")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ProductResponse>> wishlist(Authentication authentication) {
        Long userId = currentUser(authentication).getId();
        List<Long> productIds = wishlistRepository.findByUserIdOrderByAddedAtDesc(userId).stream()
                .map(WishlistItemJpaEntity::getProductId)
                .toList();
        Map<Long, Integer> displayOrder = productIds.stream()
                .collect(Collectors.toMap(id -> id, productIds::indexOf, (left, right) -> left));
        List<ProductResponse> products = productRepository.findAllById(productIds).stream()
                .sorted(Comparator.comparing(product -> displayOrder.getOrDefault(product.getId(), Integer.MAX_VALUE)))
                .map(ProductMapper::toDomain)
                .map(ProductApiMapper::toResponse)
                .toList();
        return ResponseEntity.ok(products);
    }

    @PostMapping("/wishlist/{productId}")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> addWishlist(Authentication authentication, @PathVariable Long productId) {
        Long userId = currentUser(authentication).getId();
        ProductJpaEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Product not found"));
        if (!wishlistRepository.existsByUserIdAndProductId(userId, product.getId())) {
            WishlistItemJpaEntity item = new WishlistItemJpaEntity();
            item.setUserId(userId);
            item.setProductId(product.getId());
            item.setAddedAt(OffsetDateTime.now());
            wishlistRepository.save(item);
        }
        return ResponseEntity.ok(ApiResponse.ok("Added to wishlist", null));
    }

    @DeleteMapping("/wishlist/{productId}")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> removeWishlist(Authentication authentication, @PathVariable Long productId) {
        Long userId = currentUser(authentication).getId();
        wishlistRepository.findByUserIdAndProductId(userId, productId).ifPresent(wishlistRepository::delete);
        return ResponseEntity.ok(ApiResponse.ok("Removed from wishlist", null));
    }

    @GetMapping("/orders")
    @Transactional(readOnly = true)
    public ResponseEntity<PageResult<OrderResponse>> orders(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        Long userId = currentUser(authentication).getId();
        var result = PageMapper.toResult(
                orderRepository.findByCustomerId(userId, PageMapper.toPageable(PageQuery.of(page, size, sort))),
                entity -> OrderApiMapper.toResponse(OrderMapper.toDomain(entity))
        );
        return ResponseEntity.ok(result);
    }

    @GetMapping("/orders/{orderId}")
    @Transactional(readOnly = true)
    public ResponseEntity<OrderResponse> order(Authentication authentication, @PathVariable Long orderId) {
        Long userId = currentUser(authentication).getId();
        return orderRepository.findById(orderId)
                .filter(order -> userId.equals(order.getCustomerId()))
                .map(entity -> OrderApiMapper.toResponse(OrderMapper.toDomain(entity)))
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Order not found"));
    }

    @GetMapping("/payments")
    @Transactional(readOnly = true)
    public ResponseEntity<PageResult<PaymentJpaEntity>> payments(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "paidAt,desc") String sort
    ) {
        Long userId = currentUser(authentication).getId();
        return ResponseEntity.ok(PageMapper.toResult(
                paymentRepository.findByCustomerId(userId, PageMapper.toPageable(PageQuery.of(page, size, sort))),
                payment -> payment
        ));
    }

    @GetMapping("/payments/order/{orderId}")
    @Transactional(readOnly = true)
    public ResponseEntity<PaymentJpaEntity> paymentByOrder(Authentication authentication, @PathVariable Long orderId) {
        Long userId = currentUser(authentication).getId();
        orderRepository.findById(orderId)
                .filter(order -> userId.equals(order.getCustomerId()))
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Order not found"));
        return paymentRepository.findFirstByOrderIdOrderByUpdatedAtDescIdDesc(orderId)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Payment not found"));
    }

    @GetMapping("/reviews")
    @Transactional(readOnly = true)
    public ResponseEntity<PageResult<ReviewJpaEntity>> myReviews(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "reviewedAt,desc") String sort
    ) {
        Long userId = currentUser(authentication).getId();
        return ResponseEntity.ok(PageMapper.toResult(
                reviewRepository.findByUserId(userId, PageMapper.toPageable(PageQuery.of(page, size, sort))),
                review -> review
        ));
    }

    @PostMapping("/reviews")
    @Transactional
    public ResponseEntity<ReviewJpaEntity> createReview(
            Authentication authentication,
            @Valid @RequestBody CreateReviewRequest request
    ) {
        UserJpaEntity user = currentUser(authentication);
        ProductJpaEntity product = productRepository.findById(request.productId())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Product not found"));
        ReviewJpaEntity review = new ReviewJpaEntity();
        review.setId(UUID.randomUUID().toString().replace("-", "").substring(0, 10));
        review.setProductId(product.getId());
        review.setUserId(user.getId());
        review.setOrderId(request.orderId());
        review.setRating(request.rating());
        review.setTitle(request.title());
        review.setContent(request.content());
        review.setStatus("APPROVED");
        review.setReviewerName(user.getUsername());
        review.setReviewerAvatarUrl(user.getAvatarUrl());
        review.setVerifiedPurchase(hasPurchased(user.getId(), product.getId()));
        review.setHelpfulCount(0);
        review.setReportCount(0);
        review.setReviewedAt(OffsetDateTime.now());
        ReviewJpaEntity saved = reviewRepository.save(review);
        saveReviewImages(saved, request.imageUrls());
        saved.setImages(reviewImageRepository.findByReviewIdAndActiveTrueOrderByDisplayOrderAscIdAsc(saved.getId()));
        refreshProductRating(product.getId());
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/reviews/{reviewId}/replies")
    @Transactional
    public ResponseEntity<ReviewJpaEntity> replyReview(
            Authentication authentication,
            @PathVariable String reviewId,
            @Valid @RequestBody ReplyReviewRequest request
    ) {
        UserJpaEntity user = currentUser(authentication);
        ReviewJpaEntity parent = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Review not found"));
        if (!"APPROVED".equalsIgnoreCase(parent.getStatus())) {
            throw new AppException(ErrorCode.NOT_FOUND, "Review not found");
        }

        ReviewJpaEntity reply = new ReviewJpaEntity();
        reply.setId(UUID.randomUUID().toString().replace("-", "").substring(0, 10));
        reply.setProductId(parent.getProductId());
        reply.setUserId(user.getId());
        reply.setParentReviewId(parent.getId());
        reply.setContent(request.content());
        reply.setStatus("APPROVED");
        reply.setReviewerName(user.getUsername());
        reply.setReviewerAvatarUrl(user.getAvatarUrl());
        reply.setVerifiedPurchase(false);
        reply.setHelpfulCount(0);
        reply.setReportCount(0);
        reply.setReviewedAt(OffsetDateTime.now());
        return ResponseEntity.ok(reviewRepository.save(reply));
    }

    private UserJpaEntity currentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new AppException(ErrorCode.UNAUTHORIZED, "Login required");
        }
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED, "Login required"));
    }

    private boolean hasPurchased(Long userId, Long productId) {
        return orderRepository.findByCustomerId(userId, PageMapper.toPageable(PageQuery.of(0, 100, "id,desc"))).stream()
                .flatMap(order -> order.getItems().stream())
                .anyMatch(item -> productId.equals(item.getProductId()));
    }

    private void refreshProductRating(Long productId) {
        ProductJpaEntity product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return;
        }
        List<ReviewJpaEntity> reviews = reviewRepository
                .findByProductIdAndStatusIgnoreCaseAndParentReviewIdIsNull(productId, "APPROVED", PageMapper.toPageable(PageQuery.of(0, 100, "reviewedAt,desc")))
                .getContent();
        if (reviews.isEmpty()) {
            product.setReviewCount(0);
            product.setRatingAverage(BigDecimal.ZERO);
        } else {
            List<ReviewJpaEntity> ratedReviews = reviews.stream()
                    .filter(review -> review.getRating() != null)
                    .toList();
            product.setReviewCount(ratedReviews.size());
            double average = ratedReviews.stream().mapToInt(ReviewJpaEntity::getRating).average().orElse(0);
            product.setRatingAverage(BigDecimal.valueOf(average).setScale(2, RoundingMode.HALF_UP));
        }
        productRepository.save(product);
    }

    private void saveReviewImages(ReviewJpaEntity review, List<String> imageUrls) {
        if (imageUrls == null || imageUrls.isEmpty()) {
            return;
        }

        for (int index = 0; index < imageUrls.size(); index++) {
            String imageUrl = imageUrls.get(index);
            if (imageUrl == null || imageUrl.isBlank()) {
                continue;
            }
            ReviewImageJpaEntity image = new ReviewImageJpaEntity();
            image.setReviewId(review.getId());
            image.setImageUrl(imageUrl.trim());
            image.setAltText(review.getTitle());
            image.setDisplayOrder(index + 1);
            image.setActive(true);
            reviewImageRepository.save(image);
        }
    }

    private String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    public record UpdateProfileRequest(
            @jakarta.validation.constraints.Email
            @jakarta.validation.constraints.Size(max = 100)
            String email,
            @jakarta.validation.constraints.Size(max = 120)
            String fullName,
            @jakarta.validation.constraints.Size(max = 30)
            String phone,
            @jakarta.validation.constraints.Size(max = 500)
            String address,
            @jakarta.validation.constraints.Size(max = 120)
            String city,
            @jakarta.validation.constraints.Size(max = 120)
            String district,
            @jakarta.validation.constraints.Size(max = 120)
            String ward,
            @jakarta.validation.constraints.Size(max = 500)
            String avatarUrl
    ) {
    }

    public record ChangePasswordRequest(
            @NotBlank String currentPassword,
            @NotBlank @jakarta.validation.constraints.Size(min = 6, max = 100) String newPassword
    ) {
    }

    public record CreateReviewRequest(
            @NotNull Long productId,
            Long orderId,
            @NotNull @Min(1) @Max(5) Integer rating,
            String title,
            String content,
            List<String> imageUrls
    ) {
    }

    public record ReplyReviewRequest(
            @NotBlank String content
    ) {
    }
}
