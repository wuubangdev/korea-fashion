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

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<PageResult<StorefrontProductSummaryResponse>>> products(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String brandId,
            @RequestParam(required = false) String collectionId,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String style,
            @RequestParam(required = false) String season,
            @RequestParam(required = false) BigDecimal priceMin,
            @RequestParam(required = false) BigDecimal priceMax,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Boolean newArrival,
            @RequestParam(required = false) Boolean bestSeller,
            @RequestParam(required = false) Boolean sale,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        ProductFilter filter = new ProductFilter(search, categoryId, brand, brandId, collectionId, gender, style, season, priceMin, priceMax, "ACTIVE", inStock, featured, newArrival, bestSeller, sale);
        PageResult<StorefrontProductSummaryResponse> result = productUseCase
                .list(filter, PageQuery.of(page, size, sort))
                .map(this::toSummary);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/products/{slugOrId}")
    public ResponseEntity<ApiResponse<StorefrontProductDetailResponse>> productDetail(@PathVariable String slugOrId) {
        ProductJpaEntity product = resolveProduct(slugOrId);
        if (!isActive(product)) {
            throw new AppException(ErrorCode.NOT_FOUND, "Product not found");
        }
        return ResponseEntity.ok(ApiResponse.ok(toDetail(product)));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<?>> categories() {
        return ResponseEntity.ok(ApiResponse.ok(categoryRepo.findByActiveTrueOrderByDisplayOrderAscIdAsc()));
    }

    @GetMapping("/banners")
    public ResponseEntity<ApiResponse<?>> banners() {
        return ResponseEntity.ok(ApiResponse.ok(bannerRepo.findByActiveTrueOrderByDisplayOrderAsc()));
    }

    @GetMapping("/site-settings")
    public ResponseEntity<ApiResponse<?>> siteSettings() {
        return ResponseEntity.ok(ApiResponse.ok(siteSettingRepo.findById("default").orElse(null)));
    }

    @GetMapping("/shipping-methods")
    public ResponseEntity<ApiResponse<?>> shippingMethods() {
        return ResponseEntity.ok(ApiResponse.ok(shippingMethodRepo.findByActiveTrueOrderByDisplayOrderAscIdAsc()));
    }

    @GetMapping("/payment-methods")
    public ResponseEntity<ApiResponse<?>> paymentMethods() {
        return ResponseEntity.ok(ApiResponse.ok(paymentMethodRepo.findByActiveTrueOrderByDisplayOrderAscIdAsc()));
    }

    @GetMapping("/policies")
    public ResponseEntity<ApiResponse<?>> policies() {
        return ResponseEntity.ok(ApiResponse.ok(storePolicyRepo.findByActiveTrueOrderByDisplayOrderAscIdAsc()));
    }

    @GetMapping("/policies/{slug}")
    public ResponseEntity<ApiResponse<?>> policy(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(storePolicyRepo.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Policy not found"))));
    }

    @GetMapping("/pages")
    public ResponseEntity<ApiResponse<?>> pages() {
        return ResponseEntity.ok(ApiResponse.ok(pageRepo.findByStatusIgnoreCaseOrderByPublishedAtDesc("PUBLISHED")));
    }

    @GetMapping("/pages/{slug}")
    public ResponseEntity<ApiResponse<?>> page(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(pageRepo.findBySlugAndStatusIgnoreCase(slug, "PUBLISHED")
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Page not found"))));
    }

    @GetMapping("/menus/{code}")
    public ResponseEntity<ApiResponse<?>> menu(@PathVariable String code) {
        var menu = menuRepo.findByCodeAndActiveTrue(code)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Menu not found"));
        return ResponseEntity.ok(ApiResponse.ok(menuItemRepo.findByMenuIdAndActiveTrueOrderByDisplayOrderAscIdAsc(menu.getId())));
    }

    @GetMapping("/blog-posts")
    public ResponseEntity<ApiResponse<?>> blogPosts() {
        return ResponseEntity.ok(ApiResponse.ok(blogPostRepo.findByStatusIgnoreCaseOrderByPublishedAtDesc("PUBLISHED")));
    }

    @GetMapping("/blog-posts/{slug}")
    public ResponseEntity<ApiResponse<?>> blogPost(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(blogPostRepo.findBySlugAndStatusIgnoreCase(slug, "PUBLISHED")
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Blog post not found"))));
    }

    @GetMapping("/faqs")
    public ResponseEntity<ApiResponse<?>> faqs() {
        return ResponseEntity.ok(ApiResponse.ok(faqRepo.findByActiveTrueOrderByDisplayOrderAscIdAsc()));
    }

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

    public record CouponValidationRequest(String code, BigDecimal subtotal, Long customerId) {
    }

    public record CouponValidationResponse(
            boolean valid,
            String message,
            String code,
            BigDecimal discountAmount,
            boolean freeShipping,
            BigDecimal totalAfterDiscount
    ) {
    }
}
