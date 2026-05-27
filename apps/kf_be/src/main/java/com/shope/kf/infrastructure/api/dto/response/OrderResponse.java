package com.shope.kf.infrastructure.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class OrderResponse {
    private Long id;
    private String orderCode;
    private Long customerId;
    private String guestCustomerId;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private OffsetDateTime orderDate;
    private BigDecimal subtotal;
    private BigDecimal discountTotal;
    private BigDecimal shippingFee;
    private BigDecimal taxTotal;
    private BigDecimal grandTotal;
    private BigDecimal total;
    private String status;
    private String paymentStatus;
    private String fulfillmentStatus;
    private String shipperId;
    private String shippingStatus;
    private String deliveryAddress;
    private String shippingMethodId;
    private String paymentMethodId;
    private String couponCode;
    private String cancelReason;
    private OffsetDateTime confirmedAt;
    private OffsetDateTime packedAt;
    private OffsetDateTime assignedAt;
    private OffsetDateTime shippedAt;
    private OffsetDateTime deliveredAt;
    private OffsetDateTime cancelledAt;
    private OffsetDateTime returnedAt;
    private String note;
    private List<OrderItemResponse> items;

    @Data
    @AllArgsConstructor
    @Builder
    public static class OrderItemResponse {
        private Long id;
        private Long productId;
        private Long variantId;
        private String productName;
        private String productImageUrl;
        private String sku;
        private String size;
        private String color;
        private Integer quantity;
        private BigDecimal price;
        private BigDecimal unitPrice;
        private BigDecimal discount;
        private BigDecimal total;
    }
}
