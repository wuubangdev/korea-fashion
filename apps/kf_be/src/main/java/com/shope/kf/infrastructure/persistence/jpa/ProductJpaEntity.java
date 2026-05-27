package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(
        name = "products",
        indexes = {
                @Index(name = "idx_products_slug", columnList = "slug"),
                @Index(name = "idx_products_category", columnList = "category_id"),
                @Index(name = "idx_products_status", columnList = "status"),
                @Index(name = "idx_products_price", columnList = "price"),
                @Index(name = "idx_products_featured", columnList = "featured")
        }
)
@Data
public class ProductJpaEntity extends BaseJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(length = 300)
    private String shortDescription;

    private String imageUrl;

    private BigDecimal price;

    private String brand;

    @Column(length = 30)
    private String brandId;

    private String origin;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(length = 30)
    private String collectionId;

    @Column(length = 80)
    private String sku;

    @Column(length = 120, unique = true)
    private String slug;

    @Column(length = 300)
    private String material;

    @Column(length = 500)
    private String fabricComposition;

    @Column(length = 500)
    private String careInstructions;

    @Column(length = 60)
    private String fit;

    @Column(length = 60)
    private String style;

    @Column(length = 80)
    private String occasion;

    @Column(length = 60)
    private String length;

    @Column(length = 60)
    private String neckline;

    @Column(length = 60)
    private String sleeveLength;

    @Column(length = 80)
    private String pattern;

    @Column(length = 40)
    private String gender;

    @Column(length = 60)
    private String season;

    @Column(length = 80)
    private String countryOfManufacture;

    @Column(length = 80)
    private String madeIn;

    @Column(length = 1000)
    private String warrantyPolicy;

    @Column(length = 1000)
    private String returnPolicy;

    @Column(length = 30)
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

    @Column(length = 500)
    private String tags;

    @Column(length = 160)
    private String seoTitle;

    @Column(length = 500)
    private String seoDescription;

    @Column(length = 500)
    private String seoKeywords;

    @Column(length = 500)
    private String seoThumbnailUrl;

    @Column(length = 500)
    private String canonicalUrl;

    @Column(length = 50)
    private String schemaType;

    @Column(length = 50)
    private String robots;
}
