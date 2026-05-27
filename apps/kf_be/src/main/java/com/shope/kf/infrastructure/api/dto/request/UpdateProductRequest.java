package com.shope.kf.infrastructure.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
public class UpdateProductRequest {
	@NotBlank
	@Size(max = 200)
	private String name;

	@Size(max = 1000)
	private String description;

	private String shortDescription;
	private String imageUrl;

	@NotNull
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
}
