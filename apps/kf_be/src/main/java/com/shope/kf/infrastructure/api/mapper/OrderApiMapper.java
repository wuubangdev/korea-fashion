package com.shope.kf.infrastructure.api.mapper;

import com.shope.kf.infrastructure.api.dto.request.CreateOrderRequest;
import com.shope.kf.infrastructure.api.dto.response.OrderResponse;
import com.shope.kf.domain.model.Order;
import com.shope.kf.domain.model.OrderItem;
import com.shope.kf.infrastructure.constant.CommerceStatus;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

public final class OrderApiMapper {
    private OrderApiMapper() {
    }

    public static Order toDomain(CreateOrderRequest request) {
        List<OrderItem> items = request.getItems().stream().map(OrderApiMapper::toDomainItem).collect(Collectors.toList());
        BigDecimal subtotal = items.stream().map(OrderItem::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal discountTotal = defaultAmount(request.getDiscountTotal());
        BigDecimal shippingFee = defaultAmount(request.getShippingFee());
        BigDecimal taxTotal = defaultAmount(request.getTaxTotal());
        BigDecimal grandTotal = subtotal.subtract(discountTotal).add(shippingFee).add(taxTotal);
        return Order.builder()
                .orderCode("KF" + System.currentTimeMillis())
                .customerId(request.getCustomerId())
                .guestCustomerId(request.getGuestCustomerId())
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .customerEmail(request.getCustomerEmail())
                .orderDate(OffsetDateTime.now())
                .items(items)
                .subtotal(subtotal)
                .discountTotal(discountTotal)
                .shippingFee(shippingFee)
                .taxTotal(taxTotal)
                .grandTotal(grandTotal)
                .total(grandTotal)
                .status(CommerceStatus.NEW)
                .paymentStatus(CommerceStatus.UNPAID)
                .fulfillmentStatus(CommerceStatus.UNFULFILLED)
                .shippingStatus(CommerceStatus.PENDING)
                .deliveryAddress(request.getDeliveryAddress())
                .shippingMethodId(request.getShippingMethodId())
                .paymentMethodId(request.getPaymentMethodId())
                .couponCode(request.getCouponCode())
                .note(request.getNote())
                .build();
    }

    public static OrderResponse toResponse(Order order) {
        List<OrderResponse.OrderItemResponse> items = order.getItems() == null ? List.of() : order.getItems().stream()
                .map(OrderApiMapper::toResponseItem)
                .collect(Collectors.toList());
        return OrderResponse.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .customerId(order.getCustomerId())
                .guestCustomerId(order.getGuestCustomerId())
                .customerName(order.getCustomerName())
                .customerPhone(order.getCustomerPhone())
                .customerEmail(order.getCustomerEmail())
                .orderDate(order.getOrderDate())
                .subtotal(order.getSubtotal())
                .discountTotal(order.getDiscountTotal())
                .shippingFee(order.getShippingFee())
                .taxTotal(order.getTaxTotal())
                .grandTotal(order.getGrandTotal())
                .total(order.getTotal())
                .status(order.getStatus())
                .paymentStatus(order.getPaymentStatus())
                .fulfillmentStatus(order.getFulfillmentStatus())
                .shipperId(order.getShipperId())
                .shippingStatus(order.getShippingStatus())
                .deliveryAddress(order.getDeliveryAddress())
                .shippingMethodId(order.getShippingMethodId())
                .paymentMethodId(order.getPaymentMethodId())
                .couponCode(order.getCouponCode())
                .cancelReason(order.getCancelReason())
                .confirmedAt(order.getConfirmedAt())
                .packedAt(order.getPackedAt())
                .assignedAt(order.getAssignedAt())
                .shippedAt(order.getShippedAt())
                .deliveredAt(order.getDeliveredAt())
                .cancelledAt(order.getCancelledAt())
                .returnedAt(order.getReturnedAt())
                .note(order.getNote())
                .items(items)
                .build();
    }

    private static OrderItem toDomainItem(CreateOrderRequest.OrderItemRequest request) {
        BigDecimal discount = defaultAmount(request.getDiscount());
        BigDecimal price = request.getPrice() == null ? request.getUnitPrice() : request.getPrice();
        OrderItem item = OrderItem.builder()
                .productId(request.getProductId())
                .variantId(request.getVariantId())
                .productName(request.getProductName())
                .productImageUrl(request.getProductImageUrl())
                .sku(request.getSku())
                .size(request.getSize())
                .color(request.getColor())
                .quantity(request.getQuantity())
                .price(price)
                .unitPrice(request.getUnitPrice())
                .discount(discount)
                .build();
        item.recalculateTotal();
        return item;
    }

    private static OrderResponse.OrderItemResponse toResponseItem(OrderItem item) {
        return OrderResponse.OrderItemResponse.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .variantId(item.getVariantId())
                .productName(item.getProductName())
                .productImageUrl(item.getProductImageUrl())
                .sku(item.getSku())
                .size(item.getSize())
                .color(item.getColor())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .unitPrice(item.getUnitPrice())
                .discount(item.getDiscount())
                .total(item.getTotal())
                .build();
    }

    private static BigDecimal defaultAmount(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}
