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
import com.shope.kf.infrastructure.persistence.repository.BrandJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.CategoryJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.ProductImageJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.ProductJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.ProductCollectionJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.ProductAttributeJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.ProductOptionJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.ProductOptionValueJpaRepository;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

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
            VariantJpaRepository variantRepo
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
        ProductFilter filter = new ProductFilter(null, product.getCategoryId(), product.getBrand(), product.getBrandId(), product.getCollectionId(), null, null, null, null, null, "ACTIVE", null, null, null, null, null);
        var related = productUseCase.list(filter, PageQuery.of(0, size + 1, "newest"))
                .map(this::toSummary);
        var content = related.content().stream()
                .filter(item -> !item.id().equals(product.getId()))
                .limit(size)
                .toList();
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
}
