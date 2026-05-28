package com.shope.kf.application.port.out;

import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.result.CouponValidationCommand;
import com.shope.kf.application.result.CouponValidationResult;
import com.shope.kf.infrastructure.api.dto.response.StorefrontFiltersResponse;
import com.shope.kf.infrastructure.api.dto.response.StorefrontHomeResponse;
import com.shope.kf.infrastructure.api.dto.response.StorefrontProductDetailResponse;
import com.shope.kf.infrastructure.api.dto.response.StorefrontProductSummaryResponse;

import java.math.BigDecimal;

public interface StorefrontQueryPort {
    StorefrontHomeResponse home();

    PageResult<StorefrontProductSummaryResponse> products(
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
    );

    StorefrontProductDetailResponse productDetail(String slugOrId);

    Object categories();

    Object banners();

    Object siteSettings();

    Object shippingMethods();

    Object paymentMethods();

    Object policies();

    Object policy(String slug);

    Object pages();

    Object page(String slug);

    Object menu(String code);

    Object blogPosts();

    Object blogPost(String slug);

    Object faqs();

    CouponValidationResult validateCoupon(CouponValidationCommand command);

    StorefrontFiltersResponse filters();

    Object searchSuggestions(String search, int size);

    Object relatedProducts(String slugOrId, int size);
}
