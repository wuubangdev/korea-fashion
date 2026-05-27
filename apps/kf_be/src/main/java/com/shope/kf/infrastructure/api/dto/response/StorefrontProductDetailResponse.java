package com.shope.kf.infrastructure.api.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record StorefrontProductDetailResponse(
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
        String origin,
        Long categoryId,
        String collectionId,
        String sku,
        String material,
        String fabricComposition,
        String careInstructions,
        String fit,
        String style,
        String occasion,
        String length,
        String neckline,
        String sleeveLength,
        String pattern,
        String gender,
        String season,
        String countryOfManufacture,
        String madeIn,
        String warrantyPolicy,
        String returnPolicy,
        String status,
        Integer stockQuantity,
        Boolean featured,
        Boolean newArrival,
        Boolean bestSeller,
        Boolean sale,
        Integer viewCount,
        Integer soldCount,
        BigDecimal ratingAverage,
        Integer reviewCount,
        String tags,
        String seoTitle,
        String seoDescription,
        List<ProductImageItem> images,
        List<AttributeItem> attributes,
        List<OptionItem> options,
        List<OptionValueItem> optionValues,
        List<VariantItem> variants
) {
    public record AttributeItem(
            Long id,
            String attributeKey,
            String attributeValue,
            String groupName,
            Integer displayOrder
    ) {
    }

    public record OptionItem(
            Long id,
            String code,
            String name,
            String type,
            Integer displayOrder,
            Boolean required,
            Boolean filterable
    ) {
    }

    public record OptionValueItem(
            Long id,
            Long optionId,
            String code,
            String value,
            String colorHex,
            String imageUrl,
            Integer displayOrder
    ) {
    }

    public record ProductImageItem(
            Long id,
            String imageUrl,
            String altText,
            Integer displayOrder,
            Boolean primaryImage
    ) {
    }

    public record VariantItem(
            Long id,
            String sku,
            Integer quantity,
            Integer availableQuantity,
            BigDecimal price,
            BigDecimal compareAtPrice,
            String size,
            String color,
            String colorHex,
            String imageUrl
    ) {
    }
}
