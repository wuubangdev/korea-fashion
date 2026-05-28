package com.shope.kf.domain.model;

import com.shope.kf.domain.exception.InvalidProductException;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    private Long id;
    private String name;
    private String description;
    private String shortDescription;
    private String imageUrl;
    private BigDecimal price;
    private String brand;
    private String brandId;
    private String origin;
    private Long categoryId;
    private String collectionId;
    private String sku;
    private String slug;
    private String material;
    private String fabricComposition;
    private String careInstructions;
    private String fit;
    private String style;
    private String occasion;
    private String length;
    private String neckline;
    private String sleeveLength;
    private String pattern;
    private String gender;
    private String season;
    private String countryOfManufacture;
    private String madeIn;
    private String warrantyPolicy;
    private String returnPolicy;
    private String status;
    private Integer stockQuantity;
    private Boolean featured;
    private Boolean newArrival;
    private Boolean bestSeller;
    private Boolean sale;
    private Integer viewCount;
    private Integer soldCount;
    private BigDecimal compareAtPrice;
    private BigDecimal costPrice;
    private BigDecimal ratingAverage;
    private Integer reviewCount;
    private BigDecimal weight;
    private BigDecimal packageWidth;
    private BigDecimal packageHeight;
    private BigDecimal packageLength;
    private OffsetDateTime publishedAt;
    private String tags;
    private String seoTitle;
    private String seoDescription;
    private String seoKeywords;
    private String seoThumbnailUrl;
    private String canonicalUrl;
    private String schemaType;
    private String robots;

    public void normalizeForSave() {
        if (status == null || status.isBlank()) {
            status = ProductStatus.DRAFT.name();
        } else {
            status = ProductStatus.parse(status).name();
        }
        if (price != null && price.signum() < 0) {
            throw new InvalidProductException("Product price must be zero or positive");
        }
        if (stockQuantity != null && stockQuantity < 0) {
            throw new InvalidProductException("Product stock quantity must be zero or positive");
        }
    }

    public boolean isPubliclyVisible() {
        return ProductStatus.ACTIVE.name().equals(status) || ProductStatus.PUBLISHED.name().equals(status);
    }
}
