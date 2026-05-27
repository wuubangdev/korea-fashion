package com.shope.kf.infrastructure.api.dto.response;

import com.shope.kf.infrastructure.persistence.jpa.BannerJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.CategoryJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.SiteSettingJpaEntity;

import java.util.List;

public record StorefrontHomeResponse(
        SiteSettingJpaEntity siteSettings,
        List<BannerJpaEntity> banners,
        List<CategoryJpaEntity> featuredCategories,
        List<StorefrontProductSummaryResponse> featuredProducts,
        List<StorefrontProductSummaryResponse> newArrivals,
        List<StorefrontProductSummaryResponse> bestSellers,
        List<StorefrontProductSummaryResponse> saleProducts
) {
}
