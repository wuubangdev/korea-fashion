package com.shope.kf.infrastructure.persistence.jpa.mapper;

import com.shope.kf.domain.model.OrderItem;
import com.shope.kf.infrastructure.persistence.jpa.OrderItemJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.OrderJpaEntity;

public final class OrderItemMapper {
    private OrderItemMapper() {
    }

    public static OrderItem toDomain(OrderItemJpaEntity entity) {
        if (entity == null) {
            return null;
        }
        return OrderItem.builder()
                .id(entity.getId())
                .productId(entity.getProductId())
                .variantId(entity.getVariantId())
                .productName(entity.getProductName())
                .productImageUrl(entity.getProductImageUrl())
                .sku(entity.getSku())
                .size(entity.getSize())
                .color(entity.getColor())
                .quantity(entity.getQuantity())
                .price(entity.getPrice())
                .unitPrice(entity.getUnitPrice())
                .discount(entity.getDiscount())
                .total(entity.getTotal())
                .build();
    }

    public static OrderItemJpaEntity toEntity(OrderItem item, OrderJpaEntity order) {
        if (item == null) {
            return null;
        }
        OrderItemJpaEntity entity = new OrderItemJpaEntity();
        entity.setId(item.getId());
        entity.setProductId(item.getProductId());
        entity.setVariantId(item.getVariantId());
        entity.setProductName(item.getProductName());
        entity.setProductImageUrl(item.getProductImageUrl());
        entity.setSku(item.getSku());
        entity.setSize(item.getSize());
        entity.setColor(item.getColor());
        entity.setQuantity(item.getQuantity());
        entity.setPrice(item.getPrice());
        entity.setUnitPrice(item.getUnitPrice());
        entity.setDiscount(item.getDiscount());
        entity.setTotal(item.getTotal());
        entity.setOrder(order);
        return entity;
    }
}
