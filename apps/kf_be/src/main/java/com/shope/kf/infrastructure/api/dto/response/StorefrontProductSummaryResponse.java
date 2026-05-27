package com.shope.kf.infrastructure.api.dto.response;

import java.math.BigDecimal;

public record StorefrontProductSummaryResponse(
        Long id,
        String name,
        String slug,
        String description,
        String shortDescription,
        String imageUrl,
        BigDecimal price,
        BigDecimal compareAtPrice,
        String brand,
        String brandId,
        Long categoryId,
        String collectionId,
        String status,
        Integer stockQuantity,
        Boolean featured,
        Boolean newArrival,
        Boolean bestSeller,
        Boolean sale,
        Integer soldCount,
        BigDecimal ratingAverage,
        Integer reviewCount
) {
}
