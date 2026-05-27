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
import org.springdoc.core.customizers.OperationCustomizer;
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
        description = "JWT access token. Nhập token theo dạng: Bearer <token>."
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

    @Bean
    public OpenAPI koreaFashionOpenApi() {
        return new OpenAPI()
                .components(new Components())
                .addSecurityItem(new SecurityRequirement().addList(BEARER_AUTH));
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
    public OperationCustomizer controllerTagCustomizer() {
        return (operation, handlerMethod) -> {
            String tag = resolveTag(handlerMethod);
            if (tag != null) {
                operation.setTags(java.util.List.of(tag));
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
}
