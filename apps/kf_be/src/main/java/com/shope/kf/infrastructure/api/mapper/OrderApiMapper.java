package com.shope.kf.infrastructure.api.mapper;

import com.shope.kf.infrastructure.api.dto.request.CreateOrderRequest;
import com.shope.kf.infrastructure.api.dto.response.OrderResponse;
import com.shope.kf.domain.model.Order;
import com.shope.kf.domain.model.OrderItem;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

public final class OrderApiMapper {
    private OrderApiMapper() {
    }

    public static Order toDomain(CreateOrderRequest request) {
        List<OrderItem> items = request.getItems().stream().map(OrderApiMapper::toDomainItem).collect(Collectors.toList());
        return Order.builder()
                .orderDate(OffsetDateTime.now())
                .items(items)
                .total(items.stream().map(OrderItem::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add))
                .status("NEW")
                .deliveryAddress(request.getDeliveryAddress())
                .note(request.getNote())
                .build();
    }

    public static OrderResponse toResponse(Order order) {
        List<OrderResponse.OrderItemResponse> items = order.getItems() == null ? List.of() : order.getItems().stream()
                .map(OrderApiMapper::toResponseItem)
                .collect(Collectors.toList());
        return OrderResponse.builder()
                .id(order.getId())
                .orderDate(order.getOrderDate())
                .total(order.getTotal())
                .status(order.getStatus())
                .shipperId(order.getShipperId())
                .shippingStatus(order.getShippingStatus())
                .deliveryAddress(order.getDeliveryAddress())
                .assignedAt(order.getAssignedAt())
                .shippedAt(order.getShippedAt())
                .deliveredAt(order.getDeliveredAt())
                .note(order.getNote())
                .items(items)
                .build();
    }

    private static OrderItem toDomainItem(CreateOrderRequest.OrderItemRequest request) {
        BigDecimal total = request.getUnitPrice().multiply(BigDecimal.valueOf(request.getQuantity()));
        return OrderItem.builder()
                .productId(request.getProductId())
                .variantId(request.getVariantId())
                .quantity(request.getQuantity())
                .unitPrice(request.getUnitPrice())
                .total(total)
                .build();
    }

    private static OrderResponse.OrderItemResponse toResponseItem(OrderItem item) {
        return OrderResponse.OrderItemResponse.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .variantId(item.getVariantId())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .total(item.getTotal())
                .build();
    }
}
