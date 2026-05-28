package com.shope.kf.domain.model;

import com.shope.kf.domain.exception.InvalidDomainStateException;
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
    public static final String STATUS_COMPLETED = OrderStatus.COMPLETED.name();
    public static final String STATUS_SHIPPING = OrderStatus.SHIPPING.name();
    public static final String SHIPPING_PENDING = OrderShippingStatus.PENDING.name();
    public static final String SHIPPING_ASSIGNED = OrderShippingStatus.ASSIGNED.name();
    public static final String SHIPPING_SHIPPING = OrderShippingStatus.SHIPPING.name();
    public static final String SHIPPING_DELIVERED = OrderShippingStatus.DELIVERED.name();
    public static final String SHIPPING_FAILED = OrderShippingStatus.FAILED.name();
    public static final String SHIPPING_CANCELLED = OrderShippingStatus.CANCELLED.name();

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

    public void prepareForCreation(String generatedOrderCode, OffsetDateTime now) {
        if (orderCode == null || orderCode.isBlank()) {
            orderCode = generatedOrderCode;
        }
        if (orderDate == null) {
            orderDate = now;
        }
        if (status == null || status.isBlank()) {
            status = OrderStatus.NEW.name();
        } else {
            status = OrderStatus.parse(status).name();
        }
        if (paymentStatus == null || paymentStatus.isBlank()) {
            paymentStatus = PaymentStatus.UNPAID.name();
        } else {
            paymentStatus = PaymentStatus.parse(paymentStatus).name();
        }
        if (fulfillmentStatus == null || fulfillmentStatus.isBlank()) {
            fulfillmentStatus = FulfillmentStatus.UNFULFILLED.name();
        } else {
            fulfillmentStatus = FulfillmentStatus.parse(fulfillmentStatus).name();
        }
        shippingStatus = SHIPPING_PENDING;
    }

    public void changeStatus(String nextStatus) {
        status = OrderStatus.parse(nextStatus).name();
    }

    public void assignShipper(String shipperId, OffsetDateTime assignedAt) {
        if (shipperId == null || shipperId.isBlank()) {
            throw new InvalidDomainStateException("Shipper id is required");
        }
        this.shipperId = shipperId;
        shippingStatus = SHIPPING_ASSIGNED;
        this.assignedAt = assignedAt;
    }

    public ShippingInventoryEffect changeShippingStatus(String nextStatus, OffsetDateTime now) {
        OrderShippingStatus normalizedStatus = OrderShippingStatus.parse(nextStatus);
        OrderShippingStatus previousStatus = shippingStatus == null ? null : OrderShippingStatus.parse(shippingStatus);
        if (normalizedStatus.requiresShipper() && (shipperId == null || shipperId.isBlank())) {
            throw new InvalidDomainStateException("Order has not been assigned to a shipper");
        }
        shippingStatus = normalizedStatus.name();
        if (normalizedStatus == OrderShippingStatus.SHIPPING) {
            shippedAt = now;
            status = STATUS_SHIPPING;
            return ShippingInventoryEffect.NONE;
        }
        if (normalizedStatus == OrderShippingStatus.DELIVERED) {
            deliveredAt = now;
            status = STATUS_COMPLETED;
            return previousStatus == OrderShippingStatus.DELIVERED
                    ? ShippingInventoryEffect.NONE
                    : ShippingInventoryEffect.FULFILL;
        }
        if (normalizedStatus.isTerminalFailure()) {
            status = normalizedStatus.name();
            if (normalizedStatus == OrderShippingStatus.CANCELLED) {
                cancelledAt = now;
            }
            return previousStatus != null && previousStatus.isTerminalFailure() ? ShippingInventoryEffect.NONE : ShippingInventoryEffect.RELEASE;
        }
        return ShippingInventoryEffect.NONE;
    }

    public enum ShippingInventoryEffect {
        NONE,
        FULFILL,
        RELEASE
    }

}
