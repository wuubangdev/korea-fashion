package com.shope.kf.infrastructure.api;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.common.ProductFilter;
import com.shope.kf.application.port.in.ProductUseCase;
import com.shope.kf.domain.model.Product;
import com.shope.kf.infrastructure.api.dto.response.ApiResponse;
import com.shope.kf.infrastructure.api.dto.response.StorefrontHomeResponse;
import com.shope.kf.infrastructure.api.dto.response.StorefrontFiltersResponse;
import com.shope.kf.infrastructure.api.dto.response.StorefrontProductDetailResponse;
import com.shope.kf.infrastructure.api.dto.response.StorefrontProductSummaryResponse;
import com.shope.kf.infrastructure.exception.AppException;
import com.shope.kf.infrastructure.exception.ErrorCode;
import com.shope.kf.infrastructure.persistence.jpa.ProductJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.BannerJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.BlogPostJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.BrandJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.CategoryJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.CouponJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.FaqJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.MenuItemJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.MenuJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.PageJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.ProductImageJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.ProductJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.ProductCollectionJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.ProductAttributeJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.ProductOptionJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.ProductOptionValueJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.ProductRelationJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.ProductTagJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.PaymentMethodJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.SiteSettingJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.ShippingMethodJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.StorePolicyJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.VariantJpaRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/storefront")
@Tag(name = "Storefront", description = "API công khai cho website bán hàng: home, catalog, product detail, content, menu, policy và coupon.")
public class StorefrontController {
    private final ProductUseCase productUseCase;
    private final ProductJpaRepository productRepo;
    private final CategoryJpaRepository categoryRepo;
    private final BrandJpaRepository brandRepo;
    private final ProductCollectionJpaRepository productCollectionRepo;
    private final BannerJpaRepository bannerRepo;
    private final SiteSettingJpaRepository siteSettingRepo;
    private final ProductImageJpaRepository productImageRepo;
    private final ProductAttributeJpaRepository productAttributeRepo;
    private final ProductOptionJpaRepository productOptionRepo;
    private final ProductOptionValueJpaRepository productOptionValueRepo;
    private final ProductTagJpaRepository productTagRepo;
    private final ShippingMethodJpaRepository shippingMethodRepo;
    private final PaymentMethodJpaRepository paymentMethodRepo;
    private final StorePolicyJpaRepository storePolicyRepo;
    private final VariantJpaRepository variantRepo;
    private final ProductRelationJpaRepository productRelationRepo;
    private final PageJpaRepository pageRepo;
    private final MenuJpaRepository menuRepo;
    private final MenuItemJpaRepository menuItemRepo;
    private final BlogPostJpaRepository blogPostRepo;
    private final FaqJpaRepository faqRepo;
    private final CouponJpaRepository couponRepo;

    public StorefrontController(
            ProductUseCase productUseCase,
            ProductJpaRepository productRepo,
            CategoryJpaRepository categoryRepo,
            BrandJpaRepository brandRepo,
            ProductCollectionJpaRepository productCollectionRepo,
            BannerJpaRepository bannerRepo,
            SiteSettingJpaRepository siteSettingRepo,
            ProductImageJpaRepository productImageRepo,
            ProductAttributeJpaRepository productAttributeRepo,
            ProductOptionJpaRepository productOptionRepo,
            ProductOptionValueJpaRepository productOptionValueRepo,
            ProductTagJpaRepository productTagRepo,
            ShippingMethodJpaRepository shippingMethodRepo,
            PaymentMethodJpaRepository paymentMethodRepo,
            StorePolicyJpaRepository storePolicyRepo,
            VariantJpaRepository variantRepo,
            ProductRelationJpaRepository productRelationRepo,
            PageJpaRepository pageRepo,
            MenuJpaRepository menuRepo,
            MenuItemJpaRepository menuItemRepo,
            BlogPostJpaRepository blogPostRepo,
            FaqJpaRepository faqRepo,
            CouponJpaRepository couponRepo
    ) {
        this.productUseCase = productUseCase;
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
        this.brandRepo = brandRepo;
        this.productCollectionRepo = productCollectionRepo;
        this.bannerRepo = bannerRepo;
        this.siteSettingRepo = siteSettingRepo;
        this.productImageRepo = productImageRepo;
        this.productAttributeRepo = productAttributeRepo;
        this.productOptionRepo = productOptionRepo;
        this.productOptionValueRepo = productOptionValueRepo;
        this.productTagRepo = productTagRepo;
        this.shippingMethodRepo = shippingMethodRepo;
        this.paymentMethodRepo = paymentMethodRepo;
        this.storePolicyRepo = storePolicyRepo;
        this.variantRepo = variantRepo;
        this.productRelationRepo = productRelationRepo;
        this.pageRepo = pageRepo;
        this.menuRepo = menuRepo;
        this.menuItemRepo = menuItemRepo;
        this.blogPostRepo = blogPostRepo;
        this.faqRepo = faqRepo;
        this.couponRepo = couponRepo;
    }

    @Operation(
            summary = "Dữ liệu trang chủ",
            description = "Trả về site setting, banner, category và các block sản phẩm: nổi bật, hàng mới, bán chạy, đang giảm giá."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Lấy dữ liệu trang chủ thành công")
    @GetMapping("/home")
    public ResponseEntity<ApiResponse<StorefrontHomeResponse>> home() {
        var siteSettings = siteSettingRepo.findById("default").orElse(null);
        var banners = bannerRepo.findByActiveTrueOrderByDisplayOrderAsc();
        var categories = categoryRepo.findByActiveTrueOrderByDisplayOrderAscIdAsc();
        var featuredProducts = productRepo.findAll(activeProducts().and(featuredProducts()), PageRequest.of(0, 8, Sort.by(Sort.Direction.DESC, "id")))
                .map(this::toSummary)
                .toList();
        var newArrivals = productRepo.findAll(activeProducts(), PageRequest.of(0, 8, Sort.by(Sort.Direction.DESC, "id")))
                .map(this::toSummary)
                .toList();
        var bestSellers = productRepo.findAll(activeProducts(), PageRequest.of(0, 8, Sort.by(Sort.Direction.DESC, "soldCount")))
                .map(this::toSummary)
                .toList();
        var saleProducts = productRepo.findAll(activeProducts().and(onSaleProducts()), PageRequest.of(0, 8, Sort.by(Sort.Direction.DESC, "id")))
                .map(this::toSummary)
                .toList();
        return ResponseEntity.ok(ApiResponse.ok(new StorefrontHomeResponse(siteSettings, banners, categories, featuredProducts, newArrivals, bestSellers, saleProducts)));
    }

    @Operation(
            summary = "Danh sách sản phẩm storefront",
            description = """
                    Lấy danh sách sản phẩm công khai theo bộ lọc catalog.

                    Hỗ trợ:
                    - Tìm kiếm tên/mô tả/sku bằng `search`.
                    - Lọc theo category, brand, collection, gender, style, season.
                    - Lọc khoảng giá, trạng thái tồn kho, featured, new arrival, best seller, sale.
                    - Phân trang và sort theo `field,direction`, ví dụ `id,desc`, `price,asc`.
                    """
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Lấy danh sách sản phẩm thành công"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Tham số lọc/phân trang không hợp lệ", content = @Content)
    })
    @GetMapping("/products")
    public ResponseEntity<ApiResponse<PageResult<StorefrontProductSummaryResponse>>> products(
            @Parameter(description = "Từ khóa tìm kiếm sản phẩm", example = "váy công sở") @RequestParam(required = false) String search,
            @Parameter(description = "ID danh mục", example = "1") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "Tên thương hiệu legacy", example = "Korea Fashion") @RequestParam(required = false) String brand,
            @Parameter(description = "ID thương hiệu", example = "brand-korea") @RequestParam(required = false) String brandId,
            @Parameter(description = "ID collection", example = "summer-2026") @RequestParam(required = false) String collectionId,
            @Parameter(description = "Giới tính/nhóm khách hàng", example = "WOMEN") @RequestParam(required = false) String gender,
            @Parameter(description = "Phong cách", example = "MINIMAL") @RequestParam(required = false) String style,
            @Parameter(description = "Mùa/bộ sưu tập mùa", example = "SUMMER") @RequestParam(required = false) String season,
            @Parameter(description = "Giá tối thiểu", example = "100000") @RequestParam(required = false) BigDecimal priceMin,
            @Parameter(description = "Giá tối đa", example = "500000") @RequestParam(required = false) BigDecimal priceMax,
            @Parameter(description = "Chỉ lấy sản phẩm còn hàng", example = "true") @RequestParam(required = false) Boolean inStock,
            @Parameter(description = "Sản phẩm nổi bật", example = "true") @RequestParam(required = false) Boolean featured,
            @Parameter(description = "Sản phẩm mới", example = "true") @RequestParam(required = false) Boolean newArrival,
            @Parameter(description = "Sản phẩm bán chạy", example = "true") @RequestParam(required = false) Boolean bestSeller,
            @Parameter(description = "Sản phẩm đang giảm giá", example = "true") @RequestParam(required = false) Boolean sale,
            @Parameter(description = "Trang bắt đầu từ 0", example = "0") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Số sản phẩm mỗi trang", example = "12") @RequestParam(defaultValue = "12") int size,
            @Parameter(description = "Sắp xếp `field,direction`", example = "id,desc") @RequestParam(defaultValue = "id,desc") String sort
    ) {
        ProductFilter filter = new ProductFilter(search, categoryId, brand, brandId, collectionId, gender, style, season, priceMin, priceMax, "ACTIVE", inStock, featured, newArrival, bestSeller, sale);
        PageResult<StorefrontProductSummaryResponse> result = productUseCase
                .list(filter, PageQuery.of(page, size, sort))
                .map(this::toSummary);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @Operation(
            summary = "Chi tiết sản phẩm",
            description = "Lấy chi tiết sản phẩm theo slug hoặc ID, kèm images, variants, attributes, options và option values."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Lấy chi tiết sản phẩm thành công"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tìm thấy sản phẩm hoặc sản phẩm không active", content = @Content)
    })
    @GetMapping("/products/{slugOrId}")
    public ResponseEntity<ApiResponse<StorefrontProductDetailResponse>> productDetail(
            @Parameter(description = "Slug hoặc ID sản phẩm", example = "ao-so-mi-trang") @PathVariable String slugOrId
    ) {
        ProductJpaEntity product = resolveProduct(slugOrId);
        if (!isActive(product)) {
            throw new AppException(ErrorCode.NOT_FOUND, "Product not found");
        }
        return ResponseEntity.ok(ApiResponse.ok(toDetail(product)));
    }

    @Operation(summary = "Danh mục active", description = "Lấy danh sách danh mục đang active, sắp xếp theo displayOrder rồi ID.")
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<?>> categories() {
        return ResponseEntity.ok(ApiResponse.ok(categoryRepo.findByActiveTrueOrderByDisplayOrderAscIdAsc()));
    }

    @Operation(summary = "Banner active", description = "Lấy danh sách banner đang active, dùng cho hero, campaign và các placement trên website.")
    @GetMapping("/banners")
    public ResponseEntity<ApiResponse<?>> banners() {
        return ResponseEntity.ok(ApiResponse.ok(bannerRepo.findByActiveTrueOrderByDisplayOrderAsc()));
    }

    @Operation(summary = "Thiết lập website", description = "Lấy logo, màu sắc chủ đạo/phụ, thông tin footer, social link và SEO mặc định.")
    @GetMapping("/site-settings")
    public ResponseEntity<ApiResponse<?>> siteSettings() {
        return ResponseEntity.ok(ApiResponse.ok(siteSettingRepo.findById("default").orElse(null)));
    }

    @Operation(summary = "Phương thức vận chuyển", description = "Lấy danh sách shipping method active để hiển thị trong checkout.")
    @GetMapping("/shipping-methods")
    public ResponseEntity<ApiResponse<?>> shippingMethods() {
        return ResponseEntity.ok(ApiResponse.ok(shippingMethodRepo.findByActiveTrueOrderByDisplayOrderAscIdAsc()));
    }

    @Operation(summary = "Phương thức thanh toán", description = "Lấy danh sách payment method active để hiển thị trong checkout.")
    @GetMapping("/payment-methods")
    public ResponseEntity<ApiResponse<?>> paymentMethods() {
        return ResponseEntity.ok(ApiResponse.ok(paymentMethodRepo.findByActiveTrueOrderByDisplayOrderAscIdAsc()));
    }

    @Operation(summary = "Chính sách cửa hàng", description = "Lấy danh sách policy active như đổi trả, giao hàng, bảo mật.")
    @GetMapping("/policies")
    public ResponseEntity<ApiResponse<?>> policies() {
        return ResponseEntity.ok(ApiResponse.ok(storePolicyRepo.findByActiveTrueOrderByDisplayOrderAscIdAsc()));
    }

    @Operation(summary = "Chi tiết chính sách", description = "Lấy nội dung policy theo slug.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tìm thấy policy", content = @Content)
    @GetMapping("/policies/{slug}")
    public ResponseEntity<ApiResponse<?>> policy(@Parameter(description = "Slug chính sách", example = "return-policy") @PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(storePolicyRepo.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Policy not found"))));
    }

    @Operation(summary = "Danh sách page đã publish", description = "Lấy các page nội dung đã publish, dùng cho landing/static content.")
    @GetMapping("/pages")
    public ResponseEntity<ApiResponse<?>> pages() {
        return ResponseEntity.ok(ApiResponse.ok(pageRepo.findByStatusIgnoreCaseOrderByPublishedAtDesc("PUBLISHED")));
    }

    @Operation(summary = "Chi tiết page", description = "Lấy page đã publish theo slug.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tìm thấy page", content = @Content)
    @GetMapping("/pages/{slug}")
    public ResponseEntity<ApiResponse<?>> page(@Parameter(description = "Slug page", example = "about-us") @PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(pageRepo.findBySlugAndStatusIgnoreCase(slug, "PUBLISHED")
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Page not found"))));
    }

    @Operation(summary = "Menu theo code", description = "Lấy danh sách menu item active theo menu code, dùng cho header/footer/mobile nav.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tìm thấy menu", content = @Content)
    @GetMapping("/menus/{code}")
    public ResponseEntity<ApiResponse<?>> menu(@Parameter(description = "Code menu", example = "HEADER") @PathVariable String code) {
        var menu = menuRepo.findByCodeAndActiveTrue(code)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Menu not found"));
        return ResponseEntity.ok(ApiResponse.ok(menuItemRepo.findByMenuIdAndActiveTrueOrderByDisplayOrderAscIdAsc(menu.getId())));
    }

    @Operation(summary = "Danh sách bài blog đã publish", description = "Lấy bài viết blog đã publish, sắp xếp mới nhất trước.")
    @GetMapping("/blog-posts")
    public ResponseEntity<ApiResponse<?>> blogPosts() {
        return ResponseEntity.ok(ApiResponse.ok(blogPostRepo.findByStatusIgnoreCaseOrderByPublishedAtDesc("PUBLISHED")));
    }

    @Operation(summary = "Chi tiết bài blog", description = "Lấy bài blog đã publish theo slug.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tìm thấy bài blog", content = @Content)
    @GetMapping("/blog-posts/{slug}")
    public ResponseEntity<ApiResponse<?>> blogPost(@Parameter(description = "Slug bài blog", example = "mix-do-cong-so") @PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(blogPostRepo.findBySlugAndStatusIgnoreCase(slug, "PUBLISHED")
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Blog post not found"))));
    }

    @Operation(summary = "Danh sách FAQ", description = "Lấy FAQ active để hiển thị ở trang hỗ trợ hoặc footer.")
    @GetMapping("/faqs")
    public ResponseEntity<ApiResponse<?>> faqs() {
        return ResponseEntity.ok(ApiResponse.ok(faqRepo.findByActiveTrueOrderByDisplayOrderAscIdAsc()));
    }

    @Operation(
            summary = "Kiểm tra coupon",
            description = """
                    Kiểm tra mã coupon trước khi checkout.

                    API xác thực trạng thái active, thời gian hiệu lực, giá trị đơn tối thiểu,
                    giới hạn lượt dùng và trả về discount dự kiến.
                    """,
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Thông tin coupon và subtotal hiện tại của giỏ hàng",
                    content = @Content(examples = @ExampleObject(value = """
                            {
                              "code": "SUMMER10",
                              "subtotal": 450000,
                              "customerId": 1
                            }
                            """))
            )
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Trả về kết quả coupon hợp lệ hoặc lý do không hợp lệ")
    @PostMapping("/coupons/validate")
    public ResponseEntity<ApiResponse<CouponValidationResponse>> validateCoupon(@RequestBody CouponValidationRequest request) {
        var coupon = couponRepo.findByCodeIgnoreCaseAndActiveTrue(request.code())
                .orElse(null);
        if (coupon == null) {
            return ResponseEntity.ok(ApiResponse.ok(new CouponValidationResponse(false, "Coupon not found or inactive", null, BigDecimal.ZERO, false, request.subtotal())));
        }
        LocalDateTime now = LocalDateTime.now();
        if ((coupon.getStartsAt() != null && coupon.getStartsAt().isAfter(now))
                || (coupon.getEndsAt() != null && coupon.getEndsAt().isBefore(now))) {
            return ResponseEntity.ok(ApiResponse.ok(new CouponValidationResponse(false, "Coupon is outside valid date range", coupon.getCode(), BigDecimal.ZERO, false, request.subtotal())));
        }
        BigDecimal subtotal = request.subtotal() == null ? BigDecimal.ZERO : request.subtotal();
        if (coupon.getMinOrderAmount() != null && subtotal.compareTo(coupon.getMinOrderAmount()) < 0) {
            return ResponseEntity.ok(ApiResponse.ok(new CouponValidationResponse(false, "Order subtotal does not meet minimum amount", coupon.getCode(), BigDecimal.ZERO, false, subtotal)));
        }
        if (coupon.getUsageLimit() != null && coupon.getUsedCount() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            return ResponseEntity.ok(ApiResponse.ok(new CouponValidationResponse(false, "Coupon usage limit reached", coupon.getCode(), BigDecimal.ZERO, false, subtotal)));
        }
        BigDecimal discount = calculateCouponDiscount(coupon.getDiscountType(), coupon.getDiscountValue(), coupon.getMaxDiscountAmount(), subtotal);
        BigDecimal totalAfterDiscount = subtotal.subtract(discount).max(BigDecimal.ZERO);
        return ResponseEntity.ok(ApiResponse.ok(new CouponValidationResponse(true, "Coupon is valid", coupon.getCode(), discount, Boolean.TRUE.equals(coupon.getFreeShipping()), totalAfterDiscount)));
    }

    @GetMapping("/filters")
    public ResponseEntity<ApiResponse<StorefrontFiltersResponse>> filters() {
        return ResponseEntity.ok(ApiResponse.ok(new StorefrontFiltersResponse(
                categoryRepo.findByActiveTrueOrderByDisplayOrderAscIdAsc(),
                brandRepo.findByActiveTrueOrderByDisplayOrderAscIdAsc(),
                productCollectionRepo.findByActiveTrueOrderByDisplayOrderAscIdAsc(),
                productTagRepo.findByActiveTrueOrderByDisplayOrderAscIdAsc()
        )));
    }

    @GetMapping("/search/suggestions")
    public ResponseEntity<ApiResponse<?>> searchSuggestions(
            @RequestParam String search,
            @RequestParam(defaultValue = "8") int size
    ) {
        ProductFilter filter = new ProductFilter(search, null, null, null, null, null, null, null, null, null, "ACTIVE", null, null, null, null, null);
        return ResponseEntity.ok(ApiResponse.ok(productUseCase.list(filter, PageQuery.of(0, size, "newest")).map(this::toSummary)));
    }

    @GetMapping("/products/{slugOrId}/related")
    public ResponseEntity<ApiResponse<?>> relatedProducts(
            @PathVariable String slugOrId,
            @RequestParam(defaultValue = "8") int size
    ) {
        ProductJpaEntity product = resolveProduct(slugOrId);
        var configuredRelationIds = productRelationRepo.findByProductIdAndActiveTrueOrderByDisplayOrderAscIdAsc(product.getId()).stream()
                .map(relation -> relation.getRelatedProductId())
                .limit(size)
                .toList();
        if (!configuredRelationIds.isEmpty()) {
            var content = configuredRelationIds.stream()
                    .map(productRepo::findById)
                    .flatMap(java.util.Optional::stream)
                    .filter(this::isActive)
                    .map(this::toSummary)
                    .toList();
            return ResponseEntity.ok(ApiResponse.ok(new PageResult<>(content, 0, size, content.size(), content.isEmpty() ? 0 : 1)));
        }
        ProductFilter filter = new ProductFilter(null, product.getCategoryId(), product.getBrand(), product.getBrandId(), product.getCollectionId(), null, null, null, null, null, "ACTIVE", null, null, null, null, null);
        var related = productUseCase.list(filter, PageQuery.of(0, size + 1, "newest")).map(this::toSummary);
        var content = related.content().stream().filter(item -> !item.id().equals(product.getId())).limit(size).toList();
        return ResponseEntity.ok(ApiResponse.ok(new PageResult<>(content, related.page(), size, content.size(), content.isEmpty() ? 0 : 1)));
    }

    private ProductJpaEntity resolveProduct(String slugOrId) {
        try {
            return productRepo.findById(Long.parseLong(slugOrId))
                    .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Product not found"));
        } catch (NumberFormatException ignored) {
            return productRepo.findBySlug(slugOrId)
                    .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Product not found"));
        }
    }

    private StorefrontProductSummaryResponse toSummary(Product product) {
        return new StorefrontProductSummaryResponse(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getDescription(),
                product.getShortDescription(),
                product.getImageUrl(),
                product.getPrice(),
                product.getCompareAtPrice(),
                product.getBrand(),
                product.getBrandId(),
                product.getCategoryId(),
                product.getCollectionId(),
                product.getStatus(),
                product.getStockQuantity(),
                product.getFeatured(),
                product.getNewArrival(),
                product.getBestSeller(),
                product.getSale(),
                product.getSoldCount(),
                product.getRatingAverage(),
                product.getReviewCount()
        );
    }

    private StorefrontProductSummaryResponse toSummary(ProductJpaEntity product) {
        return new StorefrontProductSummaryResponse(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getDescription(),
                product.getShortDescription(),
                product.getImageUrl(),
                product.getPrice(),
                product.getCompareAtPrice(),
                product.getBrand(),
                product.getBrandId(),
                product.getCategoryId(),
                product.getCollectionId(),
                product.getStatus(),
                product.getStockQuantity(),
                product.getFeatured(),
                product.getNewArrival(),
                product.getBestSeller(),
                product.getSale(),
                product.getSoldCount(),
                product.getRatingAverage(),
                product.getReviewCount()
        );
    }

    private StorefrontProductDetailResponse toDetail(ProductJpaEntity product) {
        var images = productImageRepo.findByProductIdAndActiveTrueOrderByDisplayOrderAscIdAsc(product.getId()).stream()
                .map(image -> new StorefrontProductDetailResponse.ProductImageItem(
                        image.getId(),
                        image.getImageUrl(),
                        image.getAltText(),
                        image.getDisplayOrder(),
                        image.getPrimaryImage()
                ))
                .toList();
        var variants = variantRepo.findByProductIdOrderByIdAsc(product.getId()).stream()
                .map(variant -> new StorefrontProductDetailResponse.VariantItem(
                        variant.getId(),
                        variant.getSku(),
                        variant.getQuantity(),
                        variant.getAvailableQuantity(),
                        variant.getPrice(),
                        variant.getCompareAtPrice(),
                        variant.getSize(),
                        variant.getColor(),
                        variant.getColorHex(),
                        variant.getImageUrl()
                ))
                .toList();
        var attributes = productAttributeRepo.findByProductIdAndVisibleTrueOrderByDisplayOrderAscIdAsc(product.getId()).stream()
                .map(attribute -> new StorefrontProductDetailResponse.AttributeItem(
                        attribute.getId(),
                        attribute.getAttributeKey(),
                        attribute.getAttributeValue(),
                        attribute.getGroupName(),
                        attribute.getDisplayOrder()
                ))
                .toList();
        var options = productOptionRepo.findByProductIdAndActiveTrueOrderByDisplayOrderAscIdAsc(product.getId()).stream()
                .map(option -> new StorefrontProductDetailResponse.OptionItem(
                        option.getId(),
                        option.getCode(),
                        option.getName(),
                        option.getType(),
                        option.getDisplayOrder(),
                        option.getRequired(),
                        option.getFilterable()
                ))
                .toList();
        var optionValues = productOptionValueRepo.findByProductIdAndActiveTrueOrderByDisplayOrderAscIdAsc(product.getId()).stream()
                .map(value -> new StorefrontProductDetailResponse.OptionValueItem(
                        value.getId(),
                        value.getOptionId(),
                        value.getCode(),
                        value.getValue(),
                        value.getColorHex(),
                        value.getImageUrl(),
                        value.getDisplayOrder()
                ))
                .toList();
        return new StorefrontProductDetailResponse(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getDescription(),
                product.getShortDescription(),
                product.getImageUrl(),
                product.getPrice(),
                product.getCompareAtPrice(),
                product.getBrand(),
                product.getBrandId(),
                product.getOrigin(),
                product.getCategoryId(),
                product.getCollectionId(),
                product.getSku(),
                product.getMaterial(),
                product.getFabricComposition(),
                product.getCareInstructions(),
                product.getFit(),
                product.getStyle(),
                product.getOccasion(),
                product.getLength(),
                product.getNeckline(),
                product.getSleeveLength(),
                product.getPattern(),
                product.getGender(),
                product.getSeason(),
                product.getCountryOfManufacture(),
                product.getMadeIn(),
                product.getWarrantyPolicy(),
                product.getReturnPolicy(),
                product.getStatus(),
                product.getStockQuantity(),
                product.getFeatured(),
                product.getNewArrival(),
                product.getBestSeller(),
                product.getSale(),
                product.getViewCount(),
                product.getSoldCount(),
                product.getRatingAverage(),
                product.getReviewCount(),
                product.getTags(),
                product.getSeoTitle(),
                product.getSeoDescription(),
                images,
                attributes,
                options,
                optionValues,
                variants
        );
    }

    private Specification<ProductJpaEntity> activeProducts() {
        return (root, query, cb) -> cb.or(cb.isNull(root.get("status")), cb.equal(cb.upper(root.get("status")), "ACTIVE"));
    }

    private Specification<ProductJpaEntity> featuredProducts() {
        return (root, query, cb) -> cb.isTrue(root.get("featured"));
    }

    private Specification<ProductJpaEntity> onSaleProducts() {
        return (root, query, cb) -> cb.isNotNull(root.get("compareAtPrice"));
    }

    private boolean isActive(ProductJpaEntity product) {
        return product.getStatus() == null || "ACTIVE".equalsIgnoreCase(product.getStatus());
    }

    private BigDecimal calculateCouponDiscount(String discountType, BigDecimal discountValue, BigDecimal maxDiscountAmount, BigDecimal subtotal) {
        if (discountValue == null || subtotal == null || subtotal.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        BigDecimal discount;
        if ("PERCENT".equalsIgnoreCase(discountType)) {
            discount = subtotal.multiply(discountValue).divide(BigDecimal.valueOf(100));
        } else {
            discount = discountValue;
        }
        if (maxDiscountAmount != null && discount.compareTo(maxDiscountAmount) > 0) {
            return maxDiscountAmount;
        }
        return discount.min(subtotal).max(BigDecimal.ZERO);
    }

    @Schema(description = "Request kiểm tra coupon trước checkout.")
    public record CouponValidationRequest(
            @Schema(description = "Mã coupon khách hàng nhập.", example = "SUMMER10")
            String code,
            @Schema(description = "Tạm tính giỏ hàng trước giảm giá và phí vận chuyển.", example = "450000")
            BigDecimal subtotal,
            @Schema(description = "ID khách hàng đăng nhập, có thể null nếu là guest.", example = "1")
            Long customerId
    ) {
    }

    @Schema(description = "Kết quả kiểm tra coupon và số tiền giảm dự kiến.")
    public record CouponValidationResponse(
            @Schema(description = "Coupon có hợp lệ tại thời điểm kiểm tra hay không.", example = "true")
            boolean valid,
            @Schema(description = "Thông báo chi tiết cho frontend hiển thị.", example = "Coupon is valid")
            String message,
            @Schema(description = "Mã coupon đã kiểm tra.", example = "SUMMER10")
            String code,
            @Schema(description = "Số tiền được giảm.", example = "45000")
            BigDecimal discountAmount,
            @Schema(description = "Coupon có miễn phí vận chuyển hay không.", example = "false")
            boolean freeShipping,
            @Schema(description = "Tổng tiền sau khi trừ discount, chưa bao gồm phí khác nếu checkout tính riêng.", example = "405000")
            BigDecimal totalAfterDiscount
    ) {
    }
}
