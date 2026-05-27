package com.shope.kf.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
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
    private List<OrderItem> items;
}
