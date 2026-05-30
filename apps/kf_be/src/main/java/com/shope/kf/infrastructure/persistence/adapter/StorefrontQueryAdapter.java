package com.shope.kf.infrastructure.persistence.adapter;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.common.ProductFilter;
import com.shope.kf.application.port.in.ProductUseCase;
import com.shope.kf.application.port.out.StorefrontQueryPort;
import com.shope.kf.application.result.CouponValidationCommand;
import com.shope.kf.application.result.CouponValidationResult;
import com.shope.kf.domain.model.Product;
import com.shope.kf.infrastructure.api.dto.response.StorefrontHomeResponse;
import com.shope.kf.infrastructure.api.dto.response.StorefrontFiltersResponse;
import com.shope.kf.infrastructure.api.dto.response.StorefrontProductDetailResponse;
import com.shope.kf.infrastructure.api.dto.response.StorefrontProductSummaryResponse;
import com.shope.kf.infrastructure.constant.CommerceStatus;
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
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class StorefrontQueryAdapter implements StorefrontQueryPort {
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

    public StorefrontQueryAdapter(
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

    public StorefrontHomeResponse home() {
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
        return new StorefrontHomeResponse(siteSettings, banners, categories, featuredProducts, newArrivals, bestSellers, saleProducts);
    }

    public PageResult<StorefrontProductSummaryResponse> products(
            String search,
            Long categoryId,
            String brand,
            String brandId,
            String collectionId,
            String gender,
            String style,
            String season,
            BigDecimal priceMin,
            BigDecimal priceMax,
            Boolean inStock,
            Boolean featured,
            Boolean newArrival,
            Boolean bestSeller,
            Boolean sale,
            int page,
            int size,
            String sort
    ) {
        ProductFilter filter = new ProductFilter(search, categoryId, brand, brandId, collectionId, gender, style, season, priceMin, priceMax, CommerceStatus.ACTIVE, inStock, featured, newArrival, bestSeller, sale);
        PageResult<StorefrontProductSummaryResponse> result = productUseCase
                .list(filter, PageQuery.of(page, size, sort))
                .map(this::toSummary);
        return result;
    }

    public StorefrontProductDetailResponse productDetail(
            String slugOrId
    ) {
        ProductJpaEntity product = resolveProduct(slugOrId);
        if (!isActive(product)) {
            throw new AppException(ErrorCode.NOT_FOUND, "Product not found");
        }
        return toDetail(product);
    }

    public Object categories() {
        return categoryRepo.findByActiveTrueOrderByDisplayOrderAscIdAsc();
    }

    public Object banners() {
        return bannerRepo.findByActiveTrueOrderByDisplayOrderAsc();
    }

    public Object siteSettings() {
        return siteSettingRepo.findById("default").orElse(null);
    }

    public Object shippingMethods() {
        return shippingMethodRepo.findByActiveTrueOrderByDisplayOrderAscIdAsc();
    }

    public Object paymentMethods() {
        return paymentMethodRepo.findByActiveTrueOrderByDisplayOrderAscIdAsc();
    }

    public Object policies() {
        return storePolicyRepo.findByActiveTrueOrderByDisplayOrderAscIdAsc();
    }

    public Object policy(String slug) {
        return storePolicyRepo.findBySlugAndActiveTrue(slug).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Policy not found"));
    }

    public Object pages() {
        return pageRepo.findByStatusIgnoreCaseOrderByPublishedAtDesc(CommerceStatus.PUBLISHED);
    }

    public Object page(String slug) {
        return pageRepo.findBySlugAndStatusIgnoreCase(slug, CommerceStatus.PUBLISHED).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Page not found"));
    }

    public Object menu(String code) {
        var menu = menuRepo.findByCodeAndActiveTrue(code)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Menu not found"));
        return menuItemRepo.findByMenuIdAndActiveTrueOrderByDisplayOrderAscIdAsc(menu.getId());
    }

    public Object blogPosts() {
        return blogPostRepo.findByStatusIgnoreCaseOrderByPublishedAtDesc(CommerceStatus.PUBLISHED);
    }

    public Object blogPost(String slug) {
        return blogPostRepo.findBySlugAndStatusIgnoreCase(slug, CommerceStatus.PUBLISHED).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Blog post not found"));
    }

    public Object faqs() {
        return faqRepo.findByActiveTrueOrderByDisplayOrderAscIdAsc();
    }

    public CouponValidationResult validateCoupon(CouponValidationCommand request) {
        var coupon = couponRepo.findByCodeIgnoreCaseAndActiveTrue(request.code())
                .orElse(null);
        if (coupon == null) {
            return new CouponValidationResult(false, "Coupon not found or inactive", null, BigDecimal.ZERO, false, request.subtotal());
        }
        LocalDateTime now = LocalDateTime.now();
        if ((coupon.getStartsAt() != null && coupon.getStartsAt().isAfter(now))
                || (coupon.getEndsAt() != null && coupon.getEndsAt().isBefore(now))) {
            return new CouponValidationResult(false, "Coupon is outside valid date range", coupon.getCode(), BigDecimal.ZERO, false, request.subtotal());
        }
        BigDecimal subtotal = request.subtotal() == null ? BigDecimal.ZERO : request.subtotal();
        if (coupon.getMinOrderAmount() != null && subtotal.compareTo(coupon.getMinOrderAmount()) < 0) {
            return new CouponValidationResult(false, "Order subtotal does not meet minimum amount", coupon.getCode(), BigDecimal.ZERO, false, subtotal);
        }
        if (coupon.getUsageLimit() != null && coupon.getUsedCount() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            return new CouponValidationResult(false, "Coupon usage limit reached", coupon.getCode(), BigDecimal.ZERO, false, subtotal);
        }
        BigDecimal discount = calculateCouponDiscount(coupon.getDiscountType(), coupon.getDiscountValue(), coupon.getMaxDiscountAmount(), subtotal);
        BigDecimal totalAfterDiscount = subtotal.subtract(discount).max(BigDecimal.ZERO);
        return new CouponValidationResult(true, "Coupon is valid", coupon.getCode(), discount, Boolean.TRUE.equals(coupon.getFreeShipping()), totalAfterDiscount);
    }
    public StorefrontFiltersResponse filters() {
        return new StorefrontFiltersResponse(
                categoryRepo.findByActiveTrueOrderByDisplayOrderAscIdAsc(),
                brandRepo.findByActiveTrueOrderByDisplayOrderAscIdAsc(),
                productCollectionRepo.findByActiveTrueOrderByDisplayOrderAscIdAsc(),
                productTagRepo.findByActiveTrueOrderByDisplayOrderAscIdAsc()
        );
    }

    public Object searchSuggestions(
            String search,
            int size
    ) {
        ProductFilter filter = new ProductFilter(search, null, null, null, null, null, null, null, null, null, CommerceStatus.ACTIVE, null, null, null, null, null);
        return productUseCase.list(filter, PageQuery.of(0, size, "newest")).map(this::toSummary);
    }
    public Object relatedProducts(
            String slugOrId,
            int size
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
            return new PageResult<>(content, 0, size, content.size(), content.isEmpty() ? 0 : 1);
        }
        ProductFilter filter = new ProductFilter(null, product.getCategoryId(), product.getBrand(), product.getBrandId(), product.getCollectionId(), null, null, null, null, null, CommerceStatus.ACTIVE, null, null, null, null, null);
        var related = productUseCase.list(filter, PageQuery.of(0, size + 1, "newest")).map(this::toSummary);
        var content = related.content().stream().filter(item -> !item.id().equals(product.getId())).limit(size).toList();
        return new PageResult<>(content, related.page(), size, content.size(), content.isEmpty() ? 0 : 1);
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
                product.getSeoKeywords(),
                product.getSeoThumbnailUrl(),
                product.getCanonicalUrl(),
                images,
                attributes,
                options,
                optionValues,
                variants
        );
    }

    private Specification<ProductJpaEntity> activeProducts() {
        return (root, query, cb) -> cb.or(cb.isNull(root.get("status")), cb.equal(cb.upper(root.get("status")), CommerceStatus.ACTIVE));
    }

    private Specification<ProductJpaEntity> featuredProducts() {
        return (root, query, cb) -> cb.isTrue(root.get("featured"));
    }

    private Specification<ProductJpaEntity> onSaleProducts() {
        return (root, query, cb) -> cb.isNotNull(root.get("compareAtPrice"));
    }

    private boolean isActive(ProductJpaEntity product) {
        return product.getStatus() == null || CommerceStatus.ACTIVE.equalsIgnoreCase(product.getStatus());
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
}
