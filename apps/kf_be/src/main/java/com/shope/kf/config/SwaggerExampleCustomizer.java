package com.shope.kf.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.parameters.Parameter;
import org.springdoc.core.customizers.GlobalOpenApiCustomizer;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.HashSet;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

/**
 * Makes the generated Swagger forms useful without having to annotate every JPA
 * entity. Springdoc otherwise renders placeholder values such as "string" and
 * also exposes audit fields in write request examples.
 */
final class SwaggerExampleCustomizer implements GlobalOpenApiCustomizer {
    private static final Set<String> READ_ONLY_FIELDS = Set.of(
            "version", "createdAt", "updatedAt", "createdBy", "updatedBy",
            "deletedAt", "deletedBy", "deleted"
    );

    private static final Map<String, Object> EXAMPLES = Map.ofEntries(
            Map.entry("username", "admin"),
            Map.entry("password", "adminpass"),
            Map.entry("email", "customer@example.com"),
            Map.entry("customerEmail", "customer@example.com"),
            Map.entry("fullName", "Nguyen Van An"),
            Map.entry("customerName", "Nguyen Van An"),
            Map.entry("customerPhone", "0901234567"),
            Map.entry("phone", "0901234567"),
            Map.entry("address", "123 Nguyen Trai, Quan 1, TP.HCM"),
            Map.entry("deliveryAddress", "123 Nguyen Trai, Quan 1, TP.HCM"),
            Map.entry("city", "TP.HCM"),
            Map.entry("district", "Quan 1"),
            Map.entry("ward", "Phuong Ben Thanh"),
            Map.entry("name", "Ao thun Han Quoc basic"),
            Map.entry("productName", "Ao thun Han Quoc basic"),
            Map.entry("title", "Bo suu tap mua thu"),
            Map.entry("description", "San pham thoi trang Han Quoc, chat lieu mem mai."),
            Map.entry("shortDescription", "Ao thun cotton form rong."),
            Map.entry("summary", "Thong tin tom tat de thu API."),
            Map.entry("content", "Noi dung mau co the gui truc tiep tu Swagger."),
            Map.entry("message", "Toi muon tim ao thun mau den"),
            Map.entry("keyword", "ao thun"),
            Map.entry("code", "SWAGGER-DEMO"),
            Map.entry("couponCode", "WELCOME10"),
            Map.entry("sku", "KF-TSHIRT-001"),
            Map.entry("barcode", "8938505974190"),
            Map.entry("slug", "ao-thun-han-quoc-basic"),
            Map.entry("brand", "Korea Fashion"),
            Map.entry("country", "Korea"),
            Map.entry("origin", "Korea"),
            Map.entry("madeIn", "Korea"),
            Map.entry("countryOfManufacture", "Korea"),
            Map.entry("material", "Cotton"),
            Map.entry("fabricComposition", "100% cotton"),
            Map.entry("size", "M"),
            Map.entry("color", "Black"),
            Map.entry("colorHex", "#111111"),
            Map.entry("gender", "UNISEX"),
            Map.entry("style", "CASUAL"),
            Map.entry("season", "ALL_SEASON"),
            Map.entry("status", "ACTIVE"),
            Map.entry("paymentStatus", "PAID"),
            Map.entry("shippingStatus", "ASSIGNED"),
            Map.entry("reaction", "LIKE"),
            Map.entry("type", "ADJUSTMENT"),
            Map.entry("referenceType", "MANUAL"),
            Map.entry("referenceId", "SWAGGER-DEMO"),
            Map.entry("shippingMethodId", "standard"),
            Map.entry("paymentMethodId", "cod"),
            Map.entry("shipperId", "shipper"),
            Map.entry("imageUrl", "https://picsum.photos/seed/kf-product/800/1000"),
            Map.entry("logoUrl", "https://picsum.photos/seed/kf-logo/300/120"),
            Map.entry("website", "https://korea-fashion.local"),
            Map.entry("canonicalUrl", "https://korea-fashion.local/products/ao-thun-han-quoc-basic"),
            Map.entry("sort", "id,desc"),
            Map.entry("search", "ao thun"),
            Map.entry("note", "Du lieu tao tu Swagger UI")
    );
    private static final Map<String, String> SPECIAL_OPERATION_SUMMARIES = Map.ofEntries(
            Map.entry("POST /api/storefront/search/keywords", "Ghi nhận từ khóa khách hàng vừa tìm kiếm"),
            Map.entry("POST /api/storefront/coupons/validate", "Kiểm tra mã giảm giá cho giỏ hàng"),
            Map.entry("GET /api/storefront/site-settings", "Lấy cấu hình hiển thị của cửa hàng"),
            Map.entry("GET /api/storefront/shipping-methods", "Lấy các phương thức giao hàng đang khả dụng"),
            Map.entry("GET /api/storefront/search/suggestions", "Gợi ý từ khóa tìm kiếm sản phẩm"),
            Map.entry("GET /api/storefront/search/popular", "Lấy các từ khóa được tìm kiếm nhiều"),
            Map.entry("GET /api/storefront/products", "Tìm và lọc danh sách sản phẩm bán trên storefront"),
            Map.entry("GET /api/storefront/products/{slugOrId}", "Xem chi tiết sản phẩm theo slug hoặc ID"),
            Map.entry("GET /api/storefront/products/{slugOrId}/related", "Lấy các sản phẩm liên quan"),
            Map.entry("GET /api/storefront/policies", "Lấy danh sách chính sách cửa hàng"),
            Map.entry("GET /api/storefront/policies/{slug}", "Xem một chính sách cửa hàng theo slug"),
            Map.entry("GET /api/storefront/payment-methods", "Lấy các phương thức thanh toán đang khả dụng"),
            Map.entry("GET /api/storefront/pages", "Lấy danh sách trang nội dung công khai"),
            Map.entry("GET /api/storefront/pages/{slug}", "Xem trang nội dung theo slug"),
            Map.entry("GET /api/storefront/menus/{code}", "Lấy menu và các mục menu theo mã"),
            Map.entry("GET /api/storefront/home", "Lấy toàn bộ dữ liệu cần cho trang chủ"),
            Map.entry("GET /api/storefront/filters", "Lấy các lựa chọn dùng để lọc sản phẩm"),
            Map.entry("GET /api/storefront/faqs", "Lấy câu hỏi thường gặp đang công khai"),
            Map.entry("GET /api/storefront/categories", "Lấy cây danh mục sản phẩm công khai"),
            Map.entry("GET /api/storefront/blog-posts", "Lấy danh sách bài viết công khai"),
            Map.entry("GET /api/storefront/blog-posts/{slug}", "Xem bài viết theo slug"),
            Map.entry("GET /api/storefront/banners", "Lấy banner đang hiển thị trên storefront"),
            Map.entry("GET /api/health", "Kiểm tra backend có đang hoạt động"),
            Map.entry("PUT /api/orders/{id}/status", "Cập nhật trạng thái xử lý đơn hàng"),
            Map.entry("PUT /api/orders/{id}/shipping-status", "Cập nhật trạng thái giao hàng của đơn"),
            Map.entry("PUT /api/orders/{id}/shipper", "Gán nhân viên giao hàng cho đơn"),
            Map.entry("PUT /api/orders/{id}/payment-status", "Cập nhật trạng thái thanh toán của đơn"),
            Map.entry("GET /api/orders/shipper/{shipperId}", "Lấy các đơn được giao cho một shipper"),
            Map.entry("GET /api/variants/product/{productId}", "Lấy các biến thể thuộc một sản phẩm"),
            Map.entry("GET /api/products/{id}/reviews", "Lấy đánh giá đã duyệt của một sản phẩm"),
            Map.entry("GET /api/site-settings/current", "Lấy cấu hình website hiện đang sử dụng"),
            Map.entry("POST /api/inventory/adjust", "Điều chỉnh số lượng tồn kho của biến thể"),
            Map.entry("GET /api/admin/dashboard/stats", "Lấy các chỉ số tổng quan cho dashboard admin"),
            Map.entry("GET /api/admin/dashboard/recent-orders", "Lấy các đơn hàng mới nhất cho dashboard"),
            Map.entry("GET /api/admin/dashboard/low-stock-products", "Lấy sản phẩm sắp hết hàng"),
            Map.entry("GET /api/media", "Tìm và phân trang thư viện media"),
            Map.entry("GET /api/media/trash", "Lấy các file media đã xóa mềm"),
            Map.entry("GET /api/media/folders", "Lấy danh sách thư mục media"),
            Map.entry("POST /api/media/folders", "Tạo thư mục media mới"),
            Map.entry("POST /api/media/upload", "Tải file mới lên thư viện media"),
            Map.entry("POST /api/media/link", "Thêm media từ một URL bên ngoài"),
            Map.entry("PUT /api/media/{id}", "Cập nhật thông tin file media"),
            Map.entry("DELETE /api/media/{id}", "Xóa mềm file media"),
            Map.entry("POST /api/media/{id}/restore", "Khôi phục file media đã xóa mềm"),
            Map.entry("DELETE /api/media/{id}/hard", "Xóa vĩnh viễn file media và dữ liệu liên quan"),
            Map.entry("GET /api/me/profile", "Lấy hồ sơ của tài khoản đang đăng nhập"),
            Map.entry("POST /api/me/profile", "Cập nhật hồ sơ của tài khoản đang đăng nhập"),
            Map.entry("POST /api/me/password", "Đổi mật khẩu của tài khoản đang đăng nhập"),
            Map.entry("POST /api/me/avatar", "Cập nhật ảnh đại diện của tài khoản"),
            Map.entry("GET /api/me/orders", "Lấy lịch sử đơn hàng của tài khoản"),
            Map.entry("GET /api/me/orders/{orderId}", "Xem một đơn hàng thuộc tài khoản"),
            Map.entry("GET /api/me/payments", "Lấy lịch sử thanh toán của tài khoản"),
            Map.entry("GET /api/me/payments/order/{orderId}", "Lấy thanh toán của một đơn hàng"),
            Map.entry("GET /api/me/wishlist", "Lấy danh sách sản phẩm yêu thích"),
            Map.entry("POST /api/me/wishlist/{productId}", "Thêm sản phẩm vào danh sách yêu thích"),
            Map.entry("DELETE /api/me/wishlist/{productId}", "Xóa sản phẩm khỏi danh sách yêu thích"),
            Map.entry("GET /api/me/reviews", "Lấy các đánh giá do tài khoản đã viết"),
            Map.entry("POST /api/me/reviews", "Gửi đánh giá mới cho sản phẩm đã mua"),
            Map.entry("POST /api/me/reviews/{reviewId}/replies", "Trả lời một đánh giá sản phẩm"),
            Map.entry("POST /api/me/reviews/{reviewId}/reaction", "Thích hoặc không thích một đánh giá"),
            Map.entry("DELETE /api/me/reviews/{reviewId}", "Xóa đánh giá của tài khoản"),
            Map.entry("GET /api/contact-messages/trash", "Lấy liên hệ khách hàng đã xóa mềm"),
            Map.entry("POST /api/contact-messages/{id}/restore", "Khôi phục một liên hệ khách hàng"),
            Map.entry("POST /api/contact-messages/trash/restore/bulk", "Khôi phục nhiều liên hệ khách hàng"),
            Map.entry("POST /api/chatbot", "Gửi câu hỏi nhanh cho chatbot tư vấn"),
            Map.entry("GET /api/chatbot/sessions", "Lấy các cuộc trò chuyện chatbot"),
            Map.entry("POST /api/chatbot/sessions", "Tạo cuộc trò chuyện chatbot mới"),
            Map.entry("DELETE /api/chatbot/sessions/{sessionId}", "Xóa một cuộc trò chuyện chatbot"),
            Map.entry("GET /api/chatbot/sessions/{sessionId}/messages", "Lấy tin nhắn trong một cuộc trò chuyện"),
            Map.entry("POST /api/chatbot/messages", "Gửi tin nhắn vào cuộc trò chuyện chatbot")
    );

    @Override
    public void customise(OpenAPI openApi) {
        customiseSchemas(openApi);
        customiseParameters(openApi);
        customiseSpecialOperations(openApi);
        removeUnusedTags(openApi);
    }

    private void customiseSchemas(OpenAPI openApi) {
        if (openApi.getComponents() == null || openApi.getComponents().getSchemas() == null) {
            return;
        }

        openApi.getComponents().getSchemas().forEach((schemaName, schema) -> {
            if (schema.getProperties() == null) {
                return;
            }
            schema.getProperties().forEach((name, value) -> {
                String propertyName = String.valueOf(name);
                if (!(value instanceof Schema<?> property)) {
                    return;
                }
                if (READ_ONLY_FIELDS.contains(propertyName)) {
                    property.setReadOnly(true);
                    return;
                }
                if (property.getExample() == null) {
                    property.setExample(exampleFor(schemaName, propertyName, property));
                }
            });
        });
    }

    private void customiseParameters(OpenAPI openApi) {
        if (openApi.getPaths() == null) {
            return;
        }
        openApi.getPaths().values().forEach(path -> path.readOperations().forEach(this::customiseOperation));
    }

    private void customiseOperation(Operation operation) {
        if (operation.getParameters() == null) {
            return;
        }
        for (Parameter parameter : operation.getParameters()) {
            Schema<?> schema = parameter.getSchema();
            if (schema == null) {
                continue;
            }

            boolean optionalQuery = "query".equals(parameter.getIn())
                    && !Boolean.TRUE.equals(parameter.getRequired());
            if (optionalQuery) {
                // Swagger UI sends examples as real query values when Try it out is enabled.
                // Keep optional filters blank; for page/size/sort and other parameters with
                // controller defaults, show that exact default instead of a field-name example.
                Object defaultValue = schema.getDefault();
                parameter.setExample(defaultValue);
                schema.setExample(null);
                continue;
            }
            if (parameter.getExample() == null) {
                parameter.setExample(exampleFor(null, parameter.getName(), schema));
            }
        }
    }

    private void removeUnusedTags(OpenAPI openApi) {
        if (openApi.getTags() == null || openApi.getPaths() == null) {
            return;
        }

        Set<String> usedTags = new HashSet<>();
        openApi.getPaths().values().forEach(path -> path.readOperations().forEach(operation -> {
            if (operation.getTags() != null) {
                usedTags.addAll(operation.getTags());
            }
        }));
        Map<String, io.swagger.v3.oas.models.tags.Tag> uniqueTags = new LinkedHashMap<>();
        openApi.getTags().stream()
                .filter(tag -> usedTags.contains(tag.getName()))
                .forEach(tag -> uniqueTags.putIfAbsent(tag.getName(), tag));
        openApi.setTags(new ArrayList<>(uniqueTags.values()));
    }

    private void customiseSpecialOperations(OpenAPI openApi) {
        if (openApi.getPaths() == null) {
            return;
        }
        openApi.getPaths().forEach((path, item) -> item.readOperationsMap().forEach((method, operation) -> {
            String summary = SPECIAL_OPERATION_SUMMARIES.get(method.name() + " " + path);
            if (summary == null) {
                return;
            }
            operation.setSummary(summary);
            if (operation.getDescription() == null || operation.getDescription().isBlank()) {
                operation.setDescription(operationDescription(method, summary));
            }
        }));
    }

    private String operationDescription(io.swagger.v3.oas.models.PathItem.HttpMethod method, String summary) {
        return switch (method) {
            case GET -> summary + ". Điền path/query parameter bên dưới nếu có; endpoint này chỉ đọc và không thay đổi dữ liệu.";
            case POST, PUT, PATCH -> summary + ". Điền path parameter và request body theo schema bên dưới nếu có trước khi bấm Execute.";
            case DELETE -> summary + ". Đây là thao tác thay đổi dữ liệu; kiểm tra đúng ID trên URL trước khi bấm Execute.";
            default -> summary + ".";
        };
    }

    private Object exampleFor(String schemaName, String name, Schema<?> schema) {
        if ("CreateOrderRequest".equals(schemaName) && "items".equals(name)) {
            return List.of(Map.of(
                    "productId", 1,
                    "productName", "Ao thun Han Quoc basic",
                    "sku", "KF-TSHIRT-001",
                    "quantity", 1,
                    "unitPrice", 199000
            ));
        }
        Object namedExample = EXAMPLES.get(name);
        if (namedExample != null) {
            return namedExample;
        }

        String normalized = name.toLowerCase(Locale.ROOT);
        if (normalized.endsWith("url")) {
            return "https://picsum.photos/seed/korea-fashion/800/1000";
        }
        if (normalized.endsWith("at") || "date-time".equals(schema.getFormat())) {
            return "2026-08-21T09:00:00Z";
        }
        if (normalized.endsWith("id")) {
            return "integer".equals(schema.getType()) ? 1L : "sample-id";
        }
        if (normalized.contains("price") || normalized.contains("amount")
                || normalized.contains("fee") || normalized.contains("total")) {
            return new BigDecimal("199000");
        }
        if (normalized.contains("quantity") || normalized.contains("count")) {
            return 1;
        }

        return switch (schema.getType() == null ? "" : schema.getType()) {
            case "boolean" -> true;
            case "integer" -> 1;
            case "number" -> new BigDecimal("1.0");
            case "array" -> List.of();
            case "string" -> "Du lieu mau";
            default -> null;
        };
    }
}
