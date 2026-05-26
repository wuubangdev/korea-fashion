package com.shope.kf.infrastructure.persistence.jpa.mapper;

import com.shope.kf.domain.model.Variant;
import com.shope.kf.infrastructure.persistence.jpa.VariantJpaEntity;

public final class VariantMapper {
    private VariantMapper() {
    }

    public static Variant toDomain(VariantJpaEntity entity) {
        if (entity == null) {
            return null;
        }
        return Variant.builder()
                .id(entity.getId())
                .productId(entity.getProductId())
                .sku(entity.getSku())
                .quantity(entity.getQuantity())
                .price(entity.getPrice())
                .size(entity.getSize())
                .color(entity.getColor())
                .build();
    }

    public static VariantJpaEntity toEntity(Variant variant) {
        if (variant == null) {
            return null;
        }
        VariantJpaEntity entity = new VariantJpaEntity();
        entity.setId(variant.getId());
        entity.setProductId(variant.getProductId());
        entity.setSku(variant.getSku());
        entity.setQuantity(variant.getQuantity());
        entity.setPrice(variant.getPrice());
        entity.setSize(variant.getSize());
        entity.setColor(variant.getColor());
        return entity;
    }
}
