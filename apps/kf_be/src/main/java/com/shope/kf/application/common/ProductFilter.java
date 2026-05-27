package com.shope.kf.application.common;

import java.math.BigDecimal;

public record ProductFilter(
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
        String status,
        Boolean inStock,
        Boolean featured,
        Boolean newArrival,
        Boolean bestSeller,
        Boolean sale
) {
}
