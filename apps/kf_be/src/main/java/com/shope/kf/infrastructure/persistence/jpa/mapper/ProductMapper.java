package com.shope.kf.infrastructure.persistence.jpa.mapper;

import com.shope.kf.domain.model.Product;
import com.shope.kf.infrastructure.persistence.jpa.ProductJpaEntity;

public final class ProductMapper {
    private ProductMapper() {
    }

    public static Product toDomain(ProductJpaEntity entity) {
        if (entity == null) {
            return null;
        }
        return Product.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .shortDescription(entity.getShortDescription())
                .imageUrl(entity.getImageUrl())
                .price(entity.getPrice())
                .brand(entity.getBrand())
                .brandId(entity.getBrandId())
                .origin(entity.getOrigin())
                .categoryId(entity.getCategoryId())
                .collectionId(entity.getCollectionId())
                .sku(entity.getSku())
                .slug(entity.getSlug())
                .material(entity.getMaterial())
                .fabricComposition(entity.getFabricComposition())
                .careInstructions(entity.getCareInstructions())
                .fit(entity.getFit())
                .style(entity.getStyle())
                .occasion(entity.getOccasion())
                .length(entity.getLength())
                .neckline(entity.getNeckline())
                .sleeveLength(entity.getSleeveLength())
                .pattern(entity.getPattern())
                .gender(entity.getGender())
                .season(entity.getSeason())
                .countryOfManufacture(entity.getCountryOfManufacture())
                .madeIn(entity.getMadeIn())
                .warrantyPolicy(entity.getWarrantyPolicy())
                .returnPolicy(entity.getReturnPolicy())
                .status(entity.getStatus())
                .stockQuantity(entity.getStockQuantity())
                .featured(entity.getFeatured())
                .newArrival(entity.getNewArrival())
                .bestSeller(entity.getBestSeller())
                .sale(entity.getSale())
                .viewCount(entity.getViewCount())
                .soldCount(entity.getSoldCount())
                .compareAtPrice(entity.getCompareAtPrice())
                .costPrice(entity.getCostPrice())
                .ratingAverage(entity.getRatingAverage())
                .reviewCount(entity.getReviewCount())
                .weight(entity.getWeight())
                .packageWidth(entity.getPackageWidth())
                .packageHeight(entity.getPackageHeight())
                .packageLength(entity.getPackageLength())
                .publishedAt(entity.getPublishedAt())
                .tags(entity.getTags())
                .seoTitle(entity.getSeoTitle())
                .seoDescription(entity.getSeoDescription())
                .seoKeywords(entity.getSeoKeywords())
                .seoThumbnailUrl(entity.getSeoThumbnailUrl())
                .canonicalUrl(entity.getCanonicalUrl())
                .schemaType(entity.getSchemaType())
                .robots(entity.getRobots())
                .build();
    }

    public static ProductJpaEntity toEntity(Product product) {
        if (product == null) {
            return null;
        }
        ProductJpaEntity entity = new ProductJpaEntity();
        entity.setId(product.getId());
        entity.setName(product.getName());
        entity.setDescription(product.getDescription());
        entity.setShortDescription(product.getShortDescription());
        entity.setImageUrl(product.getImageUrl());
        entity.setPrice(product.getPrice());
        entity.setBrand(product.getBrand());
        entity.setBrandId(product.getBrandId());
        entity.setOrigin(product.getOrigin());
        entity.setCategoryId(product.getCategoryId());
        entity.setCollectionId(product.getCollectionId());
        entity.setSku(product.getSku());
        entity.setSlug(product.getSlug());
        entity.setMaterial(product.getMaterial());
        entity.setFabricComposition(product.getFabricComposition());
        entity.setCareInstructions(product.getCareInstructions());
        entity.setFit(product.getFit());
        entity.setStyle(product.getStyle());
        entity.setOccasion(product.getOccasion());
        entity.setLength(product.getLength());
        entity.setNeckline(product.getNeckline());
        entity.setSleeveLength(product.getSleeveLength());
        entity.setPattern(product.getPattern());
        entity.setGender(product.getGender());
        entity.setSeason(product.getSeason());
        entity.setCountryOfManufacture(product.getCountryOfManufacture());
        entity.setMadeIn(product.getMadeIn());
        entity.setWarrantyPolicy(product.getWarrantyPolicy());
        entity.setReturnPolicy(product.getReturnPolicy());
        entity.setStatus(product.getStatus());
        entity.setStockQuantity(product.getStockQuantity());
        entity.setFeatured(product.getFeatured());
        entity.setNewArrival(product.getNewArrival());
        entity.setBestSeller(product.getBestSeller());
        entity.setSale(product.getSale());
        entity.setViewCount(product.getViewCount());
        entity.setSoldCount(product.getSoldCount());
        entity.setCompareAtPrice(product.getCompareAtPrice());
        entity.setCostPrice(product.getCostPrice());
        entity.setRatingAverage(product.getRatingAverage());
        entity.setReviewCount(product.getReviewCount());
        entity.setWeight(product.getWeight());
        entity.setPackageWidth(product.getPackageWidth());
        entity.setPackageHeight(product.getPackageHeight());
        entity.setPackageLength(product.getPackageLength());
        entity.setPublishedAt(product.getPublishedAt());
        entity.setTags(product.getTags());
        entity.setSeoTitle(product.getSeoTitle());
        entity.setSeoDescription(product.getSeoDescription());
        entity.setSeoKeywords(product.getSeoKeywords());
        entity.setSeoThumbnailUrl(product.getSeoThumbnailUrl());
        entity.setCanonicalUrl(product.getCanonicalUrl());
        entity.setSchemaType(product.getSchemaType());
        entity.setRobots(product.getRobots());
        return entity;
    }
}
