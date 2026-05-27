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
                .orderCode(entity.getOrderCode())
                .customerId(entity.getCustomerId())
                .guestCustomerId(entity.getGuestCustomerId())
                .customerName(entity.getCustomerName())
                .customerPhone(entity.getCustomerPhone())
                .customerEmail(entity.getCustomerEmail())
                .orderDate(entity.getOrderDate())
                .subtotal(entity.getSubtotal())
                .discountTotal(entity.getDiscountTotal())
                .shippingFee(entity.getShippingFee())
                .taxTotal(entity.getTaxTotal())
                .grandTotal(entity.getGrandTotal())
                .total(entity.getTotal())
                .status(entity.getStatus())
                .paymentStatus(entity.getPaymentStatus())
                .fulfillmentStatus(entity.getFulfillmentStatus())
                .shipperId(entity.getShipperId())
                .shippingStatus(entity.getShippingStatus())
                .deliveryAddress(entity.getDeliveryAddress())
                .shippingMethodId(entity.getShippingMethodId())
                .paymentMethodId(entity.getPaymentMethodId())
                .couponCode(entity.getCouponCode())
                .cancelReason(entity.getCancelReason())
                .confirmedAt(entity.getConfirmedAt())
                .packedAt(entity.getPackedAt())
                .assignedAt(entity.getAssignedAt())
                .shippedAt(entity.getShippedAt())
                .deliveredAt(entity.getDeliveredAt())
                .cancelledAt(entity.getCancelledAt())
                .returnedAt(entity.getReturnedAt())
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
        entity.setOrderCode(order.getOrderCode());
        entity.setCustomerId(order.getCustomerId());
        entity.setGuestCustomerId(order.getGuestCustomerId());
        entity.setCustomerName(order.getCustomerName());
        entity.setCustomerPhone(order.getCustomerPhone());
        entity.setCustomerEmail(order.getCustomerEmail());
        entity.setOrderDate(order.getOrderDate());
        entity.setSubtotal(order.getSubtotal());
        entity.setDiscountTotal(order.getDiscountTotal());
        entity.setShippingFee(order.getShippingFee());
        entity.setTaxTotal(order.getTaxTotal());
        entity.setGrandTotal(order.getGrandTotal());
        entity.setTotal(order.getTotal());
        entity.setStatus(order.getStatus());
        entity.setPaymentStatus(order.getPaymentStatus());
        entity.setFulfillmentStatus(order.getFulfillmentStatus());
        entity.setShipperId(order.getShipperId());
        entity.setShippingStatus(order.getShippingStatus());
        entity.setDeliveryAddress(order.getDeliveryAddress());
        entity.setShippingMethodId(order.getShippingMethodId());
        entity.setPaymentMethodId(order.getPaymentMethodId());
        entity.setCouponCode(order.getCouponCode());
        entity.setCancelReason(order.getCancelReason());
        entity.setConfirmedAt(order.getConfirmedAt());
        entity.setPackedAt(order.getPackedAt());
        entity.setAssignedAt(order.getAssignedAt());
        entity.setShippedAt(order.getShippedAt());
        entity.setDeliveredAt(order.getDeliveredAt());
        entity.setCancelledAt(order.getCancelledAt());
        entity.setReturnedAt(order.getReturnedAt());
        entity.setNote(order.getNote());
        entity.setItems(order.getItems() == null
                ? List.of()
                : order.getItems().stream().map(item -> OrderItemMapper.toEntity(item, entity)).collect(Collectors.toList()));
        return entity;
    }
}
