package com.shope.kf.infrastructure.api.dto.response;

import com.shope.kf.infrastructure.persistence.jpa.BrandJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.CategoryJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.ProductCollectionJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.ProductTagJpaEntity;

import java.util.List;

public record StorefrontFiltersResponse(
        List<CategoryJpaEntity> categories,
        List<BrandJpaEntity> brands,
        List<ProductCollectionJpaEntity> collections,
        List<ProductTagJpaEntity> tags
) {
}
