package com.shope.kf.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import org.springdoc.core.models.GroupedOpenApi;
import org.springdoc.core.customizers.GlobalOperationCustomizer;
import org.springdoc.core.customizers.GlobalOpenApiCustomizer;
import org.springdoc.core.properties.SwaggerUiConfigProperties;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.HandlerMethod;

import java.util.Map;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Korea Fashion Backend API",
                version = "1.0.0",
                description = """
                        API backend cho hệ thống thương mại điện tử thời trang Korea Fashion.

                        Quy ước response:
                        - Response thành công được wrap bằng `ApiResponse`.
                        - Response phân trang dùng `PageResult`.
                        - Lỗi nghiệp vụ/validation được chuẩn hóa bằng `ErrorResponse`.

                        Xác thực:
                        - Các API đọc storefront/catalog công khai không cần token.
                        - API quản trị và thao tác ghi dữ liệu cần JWT Bearer token.
                        - Hard delete chỉ dành cho ADMIN.
                        """,
                contact = @Contact(name = "Korea Fashion Backend", email = "support@korea-fashion.local"),
                license = @License(name = "Internal")
        ),
        servers = {
                @Server(url = "http://localhost:8080", description = "Local development"),
                @Server(url = "/", description = "Current host")
        },
        tags = {
                @Tag(name = "Authentication", description = "Đăng nhập, đăng ký và cấp JWT token."),
                @Tag(name = "Storefront", description = "API công khai cho trang bán hàng: home, catalog, product detail, content, coupon validation."),
                @Tag(name = "Catalog Admin", description = "Quản trị sản phẩm, biến thể, danh mục, thương hiệu, collection, tag, option, attribute, relation."),
                @Tag(name = "Order Management", description = "Quản trị đơn hàng, order item, trạng thái thanh toán/vận chuyển và inventory reservation."),
                @Tag(name = "Inventory", description = "Điều chỉnh tồn kho và lịch sử inventory transaction."),
                @Tag(name = "Checkout Config", description = "Cấu hình shipping method, payment method, policy, banner và site setting."),
                @Tag(name = "Promotion", description = "Khuyến mãi, coupon, redemption và kiểm tra coupon."),
                @Tag(name = "Return Refund Exchange", description = "Return request, return item, refund và exchange order."),
                @Tag(name = "Customer", description = "User, member, guest customer, địa chỉ khách hàng và phân quyền."),
                @Tag(name = "Payment Shipping", description = "Payment transaction, shipment và shipment event."),
                @Tag(name = "Content Management", description = "Page, menu, menu item, blog post và FAQ."),
                @Tag(name = "Review", description = "Review sản phẩm, ảnh review, verified purchase và admin reply."),
                @Tag(name = "Audit", description = "Audit log cho các thao tác ghi dữ liệu."),
                @Tag(name = "Dashboard", description = "Thống kê dashboard admin và dữ liệu vận hành nhanh."),
                @Tag(name = "Health", description = "Kiểm tra trạng thái backend.")
        }
)
@SecurityScheme(
        name = OpenApiConfig.BEARER_AUTH,
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER,
        description = "JWT access token. Chỉ dán accessToken; Swagger tự thêm tiền tố Bearer."
)
public class OpenApiConfig {
    public static final String BEARER_AUTH = "bearerAuth";
    private static final Map<String, String> CONTROLLER_TAGS = Map.ofEntries(
            Map.entry("AuthController", "Authentication"),
            Map.entry("StorefrontController", "Storefront"),
            Map.entry("HealthController", "Health"),
            Map.entry("AdminDashboardController", "Dashboard"),
            Map.entry("InventoryController", "Inventory"),
            Map.entry("InventoryTransactionController", "Inventory"),
            Map.entry("ProductController", "Catalog Admin"),
            Map.entry("VariantController", "Catalog Admin"),
            Map.entry("CategoryController", "Catalog Admin"),
            Map.entry("BrandController", "Catalog Admin"),
            Map.entry("ProductCollectionController", "Catalog Admin"),
            Map.entry("ProductImageController", "Catalog Admin"),
            Map.entry("ProductAttributeController", "Catalog Admin"),
            Map.entry("ProductOptionController", "Catalog Admin"),
            Map.entry("ProductOptionValueController", "Catalog Admin"),
            Map.entry("ProductTagController", "Catalog Admin"),
            Map.entry("ProductRelationController", "Catalog Admin"),
            Map.entry("SizeController", "Catalog Admin"),
            Map.entry("ColorController", "Catalog Admin"),
            Map.entry("SupplierController", "Inventory"),
            Map.entry("PurchaseReceiptController", "Inventory"),
            Map.entry("PurchaseReceiptItemController", "Inventory"),
            Map.entry("OrderController", "Order Management"),
            Map.entry("OrderItemController", "Order Management"),
            Map.entry("CartController", "Order Management"),
            Map.entry("CartItemController", "Order Management"),
            Map.entry("PromotionController", "Promotion"),
            Map.entry("CouponController", "Promotion"),
            Map.entry("CouponRedemptionController", "Promotion"),
            Map.entry("ReturnRequestController", "Return Refund Exchange"),
            Map.entry("ReturnItemController", "Return Refund Exchange"),
            Map.entry("RefundController", "Return Refund Exchange"),
            Map.entry("ExchangeOrderController", "Return Refund Exchange"),
            Map.entry("PaymentController", "Payment Shipping"),
            Map.entry("PaymentMethodController", "Checkout Config"),
            Map.entry("PaymentTransactionController", "Payment Shipping"),
            Map.entry("ShippingMethodController", "Checkout Config"),
            Map.entry("ShipmentController", "Payment Shipping"),
            Map.entry("ShipmentEventController", "Payment Shipping"),
            Map.entry("ShipperController", "Payment Shipping"),
            Map.entry("BannerController", "Checkout Config"),
            Map.entry("SiteSettingController", "Checkout Config"),
            Map.entry("StorePolicyController", "Checkout Config"),
            Map.entry("PageController", "Content Management"),
            Map.entry("MenuController", "Content Management"),
            Map.entry("MenuItemController", "Content Management"),
            Map.entry("BlogPostController", "Content Management"),
            Map.entry("FaqController", "Content Management"),
            Map.entry("ReviewController", "Review"),
            Map.entry("ReviewImageController", "Review"),
            Map.entry("UserController", "Customer"),
            Map.entry("MemberController", "Customer"),
            Map.entry("GuestCustomerController", "Customer"),
            Map.entry("CustomerAddressController", "Customer"),
            Map.entry("AdminController", "Customer"),
            Map.entry("AuditLogController", "Audit")
    );
    private static final Map<String, String> CONTROLLER_RESOURCES = Map.ofEntries(
            Map.entry("AdminController", "quản trị viên"),
            Map.entry("InventoryTransactionController", "giao dịch kho"),
            Map.entry("ProductController", "sản phẩm"),
            Map.entry("VariantController", "biến thể sản phẩm"),
            Map.entry("CategoryController", "danh mục sản phẩm"),
            Map.entry("BrandController", "thương hiệu"),
            Map.entry("ProductCollectionController", "bộ sưu tập sản phẩm"),
            Map.entry("ProductImageController", "hình ảnh sản phẩm"),
            Map.entry("ProductAttributeController", "thuộc tính sản phẩm"),
            Map.entry("ProductOptionController", "nhóm tùy chọn sản phẩm"),
            Map.entry("ProductOptionValueController", "giá trị tùy chọn sản phẩm"),
            Map.entry("ProductTagController", "thẻ sản phẩm"),
            Map.entry("ProductRelationController", "liên kết giữa các sản phẩm"),
            Map.entry("SizeController", "kích thước"),
            Map.entry("ColorController", "màu sắc"),
            Map.entry("SupplierController", "nhà cung cấp"),
            Map.entry("PurchaseReceiptController", "phiếu nhập kho"),
            Map.entry("PurchaseReceiptItemController", "chi tiết phiếu nhập kho"),
            Map.entry("OrderController", "đơn hàng"),
            Map.entry("OrderItemController", "sản phẩm trong đơn hàng"),
            Map.entry("CartController", "giỏ hàng"),
            Map.entry("CartItemController", "sản phẩm trong giỏ hàng"),
            Map.entry("PromotionController", "chương trình khuyến mãi"),
            Map.entry("CouponController", "mã giảm giá"),
            Map.entry("CouponRedemptionController", "lượt sử dụng mã giảm giá"),
            Map.entry("ReturnRequestController", "yêu cầu trả hàng"),
            Map.entry("ReturnItemController", "sản phẩm trả lại"),
            Map.entry("RefundController", "yêu cầu hoàn tiền"),
            Map.entry("ExchangeOrderController", "yêu cầu đổi hàng"),
            Map.entry("PaymentController", "thanh toán"),
            Map.entry("PaymentMethodController", "phương thức thanh toán"),
            Map.entry("PaymentTransactionController", "giao dịch thanh toán"),
            Map.entry("ShippingMethodController", "phương thức giao hàng"),
            Map.entry("ShipmentController", "vận đơn"),
            Map.entry("ShipmentEventController", "sự kiện vận chuyển"),
            Map.entry("ShipperController", "nhân viên giao hàng"),
            Map.entry("BannerController", "banner"),
            Map.entry("SiteSettingController", "cấu hình website"),
            Map.entry("StorePolicyController", "chính sách cửa hàng"),
            Map.entry("PageController", "trang nội dung"),
            Map.entry("MenuController", "menu"),
            Map.entry("MenuItemController", "mục menu"),
            Map.entry("BlogPostController", "bài viết"),
            Map.entry("FaqController", "câu hỏi thường gặp"),
            Map.entry("ReviewController", "đánh giá sản phẩm"),
            Map.entry("ReviewImageController", "hình ảnh đánh giá"),
            Map.entry("UserController", "tài khoản người dùng"),
            Map.entry("MemberController", "thành viên"),
            Map.entry("GuestCustomerController", "khách hàng chưa đăng ký"),
            Map.entry("CustomerAddressController", "địa chỉ khách hàng"),
            Map.entry("AuditLogController", "nhật ký thao tác")
    );

    @Bean
    public OpenAPI koreaFashionOpenApi() {
        return new OpenAPI()
                .components(new Components())
                .addSecurityItem(new SecurityRequirement().addList(BEARER_AUTH));
    }

    @Bean
    public GlobalOpenApiCustomizer swaggerExampleCustomizer() {
        return new SwaggerExampleCustomizer();
    }

    @Bean
    public InitializingBean swaggerUiUsabilityDefaults(ObjectProvider<SwaggerUiConfigProperties> provider) {
        return () -> provider.ifAvailable(properties -> {
            properties.setTryItOutEnabled(true);
            properties.setDisplayRequestDuration(true);
            properties.setPersistAuthorization(true);
        });
    }

    @Bean
    public GroupedOpenApi storefrontApi() {
        return GroupedOpenApi.builder()
                .group("01-storefront-public")
                .displayName("01 - Storefront Public APIs")
                .pathsToMatch(
                        "/api/storefront/**",
                        "/api/health/**"
                )
                .build();
    }

    @Bean
    public GroupedOpenApi adminApi() {
        return GroupedOpenApi.builder()
                .group("02-admin-private")
                .displayName("02 - Admin Private APIs")
                .pathsToMatch("/api/**")
                .pathsToExclude("/api/storefront/**", "/api/auth/**", "/api/health/**")
                .build();
    }

    @Bean
    public GroupedOpenApi authApi() {
        return GroupedOpenApi.builder()
                .group("00-auth")
                .displayName("00 - Authentication APIs")
                .pathsToMatch("/api/auth/**")
                .build();
    }

    @Bean
    public GlobalOperationCustomizer controllerTagCustomizer() {
        return (operation, handlerMethod) -> {
            String tag = resolveTag(handlerMethod);
            if (tag != null) {
                operation.setTags(java.util.List.of(tag));
            }
            String resource = resolveResource(handlerMethod);
            if (resource != null) {
                customiseCrudDescription(operation, handlerMethod.getMethod().getName(), resource);
            }
            return operation;
        };
    }

    private String resolveTag(HandlerMethod handlerMethod) {
        if (handlerMethod == null || handlerMethod.getBeanType() == null) {
            return null;
        }
        return CONTROLLER_TAGS.get(handlerMethod.getBeanType().getSimpleName());
    }

    private String resolveResource(HandlerMethod handlerMethod) {
        if (handlerMethod == null || handlerMethod.getBeanType() == null) {
            return null;
        }
        return CONTROLLER_RESOURCES.get(handlerMethod.getBeanType().getSimpleName());
    }

    private void customiseCrudDescription(io.swagger.v3.oas.models.Operation operation, String method, String resource) {
        switch (method) {
            case "create" -> {
                operation.setSummary("Tạo " + resource + " mới");
                operation.setDescription("Tạo một " + resource + " mới từ JSON trong request body. Các field được đánh dấu read-only do hệ thống tự quản lý và không cần gửi.");
            }
            case "list" -> {
                operation.setSummary("Danh sách " + resource);
                operation.setDescription("Lấy danh sách " + resource + " đang hoạt động, có tìm kiếm, phân trang và sắp xếp. Kết quả không bao gồm bản ghi đã xóa mềm.");
            }
            case "trash" -> {
                operation.setSummary("Thùng rác " + resource);
                operation.setDescription("Lấy các " + resource + " đã bị xóa mềm. Có thể dùng endpoint khôi phục để đưa bản ghi trở lại.");
            }
            case "get" -> {
                operation.setSummary("Chi tiết " + resource);
                operation.setDescription("Lấy thông tin chi tiết của một " + resource + " theo ID trên URL.");
            }
            case "update" -> {
                operation.setSummary("Cập nhật " + resource);
                operation.setDescription("Cập nhật " + resource + " có ID trên URL bằng JSON trong request body. Với PUT, nên gửi đầy đủ các field nghiệp vụ cần giữ lại.");
            }
            case "delete" -> {
                operation.setSummary("Xóa mềm " + resource);
                operation.setDescription("Đánh dấu " + resource + " là đã xóa nhưng vẫn giữ dữ liệu trong database. Có thể phục hồi bằng endpoint restore.");
            }
            case "deleteAll" -> {
                operation.setSummary("Xóa mềm nhiều " + resource);
                operation.setDescription("Nhận một mảng ID trong request body và xóa mềm các " + resource + " tương ứng. Dữ liệu vẫn có thể phục hồi.");
            }
            case "restore" -> {
                operation.setSummary("Khôi phục " + resource);
                operation.setDescription("Khôi phục một " + resource + " đã xóa mềm theo ID trên URL để bản ghi hoạt động trở lại.");
            }
            case "restoreAll" -> {
                operation.setSummary("Khôi phục nhiều " + resource);
                operation.setDescription("Nhận một mảng ID trong request body và khôi phục các " + resource + " đã xóa mềm.");
            }
            case "hardDelete" -> {
                operation.setSummary("Xóa vĩnh viễn " + resource);
                operation.setDescription("Xóa hoàn toàn " + resource + " khỏi database theo ID trên URL. Thao tác này không thể phục hồi và có thể bị từ chối nếu dữ liệu đang được bản ghi khác tham chiếu. Chỉ ADMIN được phép gọi.");
            }
            case "hardDeleteAll" -> {
                operation.setSummary("Xóa vĩnh viễn nhiều " + resource);
                operation.setDescription("Nhận một mảng ID trong request body và xóa hoàn toàn các " + resource + " khỏi database. Thao tác không thể phục hồi và chỉ dành cho ADMIN.");
            }
            case "copy" -> {
                operation.setSummary("Sao chép " + resource);
                operation.setDescription("Tạo một " + resource + " mới bằng cách sao chép dữ liệu từ bản ghi có ID trên URL; bản gốc không bị thay đổi.");
            }
            default -> {
                // Keep the endpoint-specific description for non-CRUD operations.
            }
        }
    }
}
