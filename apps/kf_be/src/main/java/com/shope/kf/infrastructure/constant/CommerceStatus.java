package com.shope.kf.infrastructure.constant;

import com.shope.kf.domain.model.ContentStatus;
import com.shope.kf.domain.model.FulfillmentStatus;
import com.shope.kf.domain.model.OrderShippingStatus;
import com.shope.kf.domain.model.OrderStatus;
import com.shope.kf.domain.model.PaymentStatus;
import com.shope.kf.domain.model.ProductStatus;

public final class CommerceStatus {
    public static final String DRAFT = ProductStatus.DRAFT.name();
    public static final String ACTIVE = ProductStatus.ACTIVE.name();
    public static final String INACTIVE = ProductStatus.INACTIVE.name();
    public static final String PUBLISHED = ContentStatus.PUBLISHED.name();
    public static final String NEW = OrderStatus.NEW.name();
    public static final String PENDING = OrderShippingStatus.PENDING.name();
    public static final String ASSIGNED = OrderShippingStatus.ASSIGNED.name();
    public static final String APPROVED = "APPROVED";
    public static final String REJECTED = "REJECTED";
    public static final String PROCESSING = OrderStatus.PROCESSING.name();
    public static final String COMPLETED = OrderStatus.COMPLETED.name();
    public static final String CANCELLED = OrderStatus.CANCELLED.name();
    public static final String FAILED = OrderStatus.FAILED.name();
    public static final String UNPAID = PaymentStatus.UNPAID.name();
    public static final String PAID = PaymentStatus.PAID.name();
    public static final String REFUNDED = PaymentStatus.REFUNDED.name();
    public static final String UNFULFILLED = FulfillmentStatus.UNFULFILLED.name();
    public static final String SHIPPING = OrderShippingStatus.SHIPPING.name();
    public static final String SHIPPED = FulfillmentStatus.SHIPPED.name();
    public static final String DELIVERED = OrderShippingStatus.DELIVERED.name();
    public static final String RETURNED = OrderStatus.RETURNED.name();

    private CommerceStatus() {
    }
}
