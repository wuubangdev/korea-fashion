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
                .imageUrl(entity.getImageUrl())
                .price(entity.getPrice())
                .brand(entity.getBrand())
                .origin(entity.getOrigin())
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
        entity.setImageUrl(product.getImageUrl());
        entity.setPrice(product.getPrice());
        entity.setBrand(product.getBrand());
        entity.setOrigin(product.getOrigin());
        return entity;
    }
}
