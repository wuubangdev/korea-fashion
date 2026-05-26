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
                .quantity(entity.getQuantity())
                .unitPrice(entity.getUnitPrice())
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
        entity.setQuantity(item.getQuantity());
        entity.setUnitPrice(item.getUnitPrice());
        entity.setTotal(item.getTotal());
        entity.setOrder(order);
        return entity;
    }
}
