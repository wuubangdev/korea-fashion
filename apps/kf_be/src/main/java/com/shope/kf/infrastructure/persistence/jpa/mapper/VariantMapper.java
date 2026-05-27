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
                .barcode(entity.getBarcode())
                .quantity(entity.getQuantity())
                .reservedQuantity(entity.getReservedQuantity())
                .availableQuantity(entity.getAvailableQuantity())
                .lowStockThreshold(entity.getLowStockThreshold())
                .price(entity.getPrice())
                .compareAtPrice(entity.getCompareAtPrice())
                .costPrice(entity.getCostPrice())
                .sizeId(entity.getSizeId())
                .size(entity.getSize())
                .colorId(entity.getColorId())
                .color(entity.getColor())
                .colorHex(entity.getColorHex())
                .weight(entity.getWeight())
                .imageUrl(entity.getImageUrl())
                .active(entity.getActive())
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
        entity.setBarcode(variant.getBarcode());
        entity.setQuantity(variant.getQuantity());
        entity.setReservedQuantity(variant.getReservedQuantity());
        entity.setAvailableQuantity(variant.getAvailableQuantity());
        entity.setLowStockThreshold(variant.getLowStockThreshold());
        entity.setPrice(variant.getPrice());
        entity.setCompareAtPrice(variant.getCompareAtPrice());
        entity.setCostPrice(variant.getCostPrice());
        entity.setSizeId(variant.getSizeId());
        entity.setSize(variant.getSize());
        entity.setColorId(variant.getColorId());
        entity.setColor(variant.getColor());
        entity.setColorHex(variant.getColorHex());
        entity.setWeight(variant.getWeight());
        entity.setImageUrl(variant.getImageUrl());
        entity.setActive(variant.getActive());
        return entity;
    }
}
