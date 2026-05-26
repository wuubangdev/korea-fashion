package com.shope.kf.infrastructure.persistence.jpa.mapper;

import com.shope.kf.domain.model.Order;
import com.shope.kf.infrastructure.persistence.jpa.OrderJpaEntity;

import java.util.List;
import java.util.stream.Collectors;

public final class OrderMapper {
    private OrderMapper() {
    }

    public static Order toDomain(OrderJpaEntity entity) {
        if (entity == null) {
            return null;
        }
        return Order.builder()
                .id(entity.getId())
                .orderDate(entity.getOrderDate())
                .total(entity.getTotal())
                .status(entity.getStatus())
                .shipperId(entity.getShipperId())
                .shippingStatus(entity.getShippingStatus())
                .deliveryAddress(entity.getDeliveryAddress())
                .assignedAt(entity.getAssignedAt())
                .shippedAt(entity.getShippedAt())
                .deliveredAt(entity.getDeliveredAt())
                .note(entity.getNote())
                .items(entity.getItems().stream().map(OrderItemMapper::toDomain).collect(Collectors.toList()))
                .build();
    }

    public static OrderJpaEntity toEntity(Order order) {
        if (order == null) {
            return null;
        }
        OrderJpaEntity entity = new OrderJpaEntity();
        entity.setId(order.getId());
        entity.setOrderDate(order.getOrderDate());
        entity.setTotal(order.getTotal());
        entity.setStatus(order.getStatus());
        entity.setShipperId(order.getShipperId());
        entity.setShippingStatus(order.getShippingStatus());
        entity.setDeliveryAddress(order.getDeliveryAddress());
        entity.setAssignedAt(order.getAssignedAt());
        entity.setShippedAt(order.getShippedAt());
        entity.setDeliveredAt(order.getDeliveredAt());
        entity.setNote(order.getNote());
        entity.setItems(order.getItems() == null
                ? List.of()
                : order.getItems().stream().map(item -> OrderItemMapper.toEntity(item, entity)).collect(Collectors.toList()));
        return entity;
    }
}
