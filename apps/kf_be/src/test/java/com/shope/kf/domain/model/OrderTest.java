package com.shope.kf.domain.model;

import com.shope.kf.domain.exception.InvalidDomainStateException;
import org.junit.jupiter.api.Test;

import java.time.OffsetDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

class OrderTest {

    @Test
    void prepareForCreation_assignsCodeDateAndPendingShippingStatus() {
        OffsetDateTime now = OffsetDateTime.parse("2026-05-28T10:00:00+07:00");
        Order order = new Order();

        order.prepareForCreation("KF123", now);

        assertEquals("KF123", order.getOrderCode());
        assertEquals(now, order.getOrderDate());
        assertEquals(OrderStatus.NEW.name(), order.getStatus());
        assertEquals(PaymentStatus.UNPAID.name(), order.getPaymentStatus());
        assertEquals(FulfillmentStatus.UNFULFILLED.name(), order.getFulfillmentStatus());
        assertEquals(Order.SHIPPING_PENDING, order.getShippingStatus());
    }

    @Test
    void changeStatus_rejectsUnknownStatus() {
        Order order = new Order();

        assertThrows(InvalidDomainStateException.class, () -> order.changeStatus("unknown"));
    }

    @Test
    void assignShipper_setsAssignedStatusAndTimestamp() {
        OffsetDateTime now = OffsetDateTime.parse("2026-05-28T11:00:00+07:00");
        Order order = new Order();

        order.assignShipper("shipper-1", now);

        assertEquals("shipper-1", order.getShipperId());
        assertEquals(Order.SHIPPING_ASSIGNED, order.getShippingStatus());
        assertEquals(now, order.getAssignedAt());
    }

    @Test
    void changeShippingStatus_deliveredReturnsFulfillEffectOnce() {
        Order order = Order.builder()
                .shipperId("shipper-1")
                .shippingStatus(Order.SHIPPING_SHIPPING)
                .build();

        Order.ShippingInventoryEffect effect = order.changeShippingStatus(
                Order.SHIPPING_DELIVERED,
                OffsetDateTime.parse("2026-05-28T12:00:00+07:00")
        );

        assertEquals(Order.ShippingInventoryEffect.FULFILL, effect);
        assertEquals(Order.STATUS_COMPLETED, order.getStatus());
        assertNotNull(order.getDeliveredAt());

        Order.ShippingInventoryEffect repeatedEffect = order.changeShippingStatus(
                Order.SHIPPING_DELIVERED,
                OffsetDateTime.parse("2026-05-28T12:05:00+07:00")
        );

        assertEquals(Order.ShippingInventoryEffect.NONE, repeatedEffect);
    }

    @Test
    void changeShippingStatus_requiresShipperBeforeNonPendingStatus() {
        Order order = Order.builder()
                .shippingStatus(Order.SHIPPING_PENDING)
                .build();

        assertThrows(InvalidDomainStateException.class, () -> order.changeShippingStatus(Order.SHIPPING_SHIPPING, OffsetDateTime.now()));
    }
}
