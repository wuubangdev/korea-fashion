package com.shope.kf.infrastructure.api;

import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.in.StorefrontUseCase;
import com.shope.kf.application.result.CouponValidationCommand;
import com.shope.kf.application.result.CouponValidationResult;
import com.shope.kf.infrastructure.api.dto.request.SearchKeywordRequest;
import com.shope.kf.infrastructure.api.dto.response.ApiResponse;
import com.shope.kf.infrastructure.api.dto.response.SearchKeywordResponse;
import com.shope.kf.infrastructure.api.dto.response.StorefrontFiltersResponse;
import com.shope.kf.infrastructure.api.dto.response.StorefrontHomeResponse;
import com.shope.kf.infrastructure.api.dto.response.StorefrontProductDetailResponse;
import com.shope.kf.infrastructure.api.dto.response.StorefrontProductSummaryResponse;
import com.shope.kf.infrastructure.search.SearchKeywordService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/storefront")
@Tag(name = "Storefront", description = "Public storefront API for home, catalog, product detail, content, menu, policy and coupon.")
public class StorefrontController {
    private final StorefrontUseCase storefrontUseCase;
    private final SearchKeywordService searchKeywordService;

    public StorefrontController(StorefrontUseCase storefrontUseCase, SearchKeywordService searchKeywordService) {
        this.storefrontUseCase = storefrontUseCase;
        this.searchKeywordService = searchKeywordService;
    }

    @GetMapping("/home")
    public ResponseEntity<ApiResponse<StorefrontHomeResponse>> home() {
        return ok(storefrontUseCase.home());
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
        return ok(storefrontUseCase.products(search, categoryId, brand, brandId, collectionId, gender, style, season,
                priceMin, priceMax, inStock, featured, newArrival, bestSeller, sale, page, size, sort));
    }

    @GetMapping("/products/{slugOrId}")
    public ResponseEntity<ApiResponse<StorefrontProductDetailResponse>> productDetail(@PathVariable String slugOrId) {
        return ok(storefrontUseCase.productDetail(slugOrId));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<Object>> categories() {
        return ok(storefrontUseCase.categories());
    }

    @GetMapping("/banners")
    public ResponseEntity<ApiResponse<Object>> banners() {
        return ok(storefrontUseCase.banners());
    }

    @GetMapping("/site-settings")
    public ResponseEntity<ApiResponse<Object>> siteSettings() {
        return ok(storefrontUseCase.siteSettings());
    }

    @GetMapping("/shipping-methods")
    public ResponseEntity<ApiResponse<Object>> shippingMethods() {
        return ok(storefrontUseCase.shippingMethods());
    }

    @GetMapping("/payment-methods")
    public ResponseEntity<ApiResponse<Object>> paymentMethods() {
        return ok(storefrontUseCase.paymentMethods());
    }

    @GetMapping("/policies")
    public ResponseEntity<ApiResponse<Object>> policies() {
        return ok(storefrontUseCase.policies());
    }

    @GetMapping("/policies/{slug}")
    public ResponseEntity<ApiResponse<Object>> policy(@Parameter(description = "Policy slug", example = "return-policy") @PathVariable String slug) {
        return ok(storefrontUseCase.policy(slug));
    }

    @GetMapping("/pages")
    public ResponseEntity<ApiResponse<Object>> pages() {
        return ok(storefrontUseCase.pages());
    }

    @GetMapping("/pages/{slug}")
    public ResponseEntity<ApiResponse<Object>> page(@PathVariable String slug) {
        return ok(storefrontUseCase.page(slug));
    }

    @GetMapping("/menus/{code}")
    public ResponseEntity<ApiResponse<Object>> menu(@PathVariable String code) {
        return ok(storefrontUseCase.menu(code));
    }

    @GetMapping("/blog-posts")
    public ResponseEntity<ApiResponse<Object>> blogPosts() {
        return ok(storefrontUseCase.blogPosts());
    }

    @GetMapping("/blog-posts/{slug}")
    public ResponseEntity<ApiResponse<Object>> blogPost(@PathVariable String slug) {
        return ok(storefrontUseCase.blogPost(slug));
    }

    @GetMapping("/faqs")
    public ResponseEntity<ApiResponse<Object>> faqs() {
        return ok(storefrontUseCase.faqs());
    }

    @PostMapping("/coupons/validate")
    public ResponseEntity<ApiResponse<CouponValidationResult>> validateCoupon(
            @RequestBody CouponValidationCommand request
    ) {
        return ok(storefrontUseCase.validateCoupon(request));
    }

    @GetMapping("/filters")
    public ResponseEntity<ApiResponse<StorefrontFiltersResponse>> filters() {
        return ok(storefrontUseCase.filters());
    }

    @GetMapping("/search/suggestions")
    public ResponseEntity<ApiResponse<Object>> searchSuggestions(
            @RequestParam String search,
            @RequestParam(defaultValue = "8") int size
    ) {
        return ok(storefrontUseCase.searchSuggestions(search, size));
    }

    @GetMapping("/search/popular")
    public ResponseEntity<ApiResponse<List<SearchKeywordResponse>>> popularSearchKeywords(
            @RequestParam(defaultValue = "8") int size
    ) {
        return ok(searchKeywordService.popular(size));
    }

    @PostMapping("/search/keywords")
    public ResponseEntity<ApiResponse<SearchKeywordResponse>> recordSearchKeyword(
            @Valid @RequestBody SearchKeywordRequest request
    ) {
        return ok(searchKeywordService.record(request.keyword()));
    }

    @GetMapping("/products/{slugOrId}/related")
    public ResponseEntity<ApiResponse<Object>> relatedProducts(
            @PathVariable String slugOrId,
            @RequestParam(defaultValue = "8") int size
    ) {
        return ok(storefrontUseCase.relatedProducts(slugOrId, size));
    }

    private <T> ResponseEntity<ApiResponse<T>> ok(T data) {
        return ResponseEntity.ok(ApiResponse.ok(data));
    }
}
