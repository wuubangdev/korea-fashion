package com.shope.kf.domain.model;

import com.shope.kf.domain.exception.InvalidDomainStateException;

import java.util.Locale;

public enum OrderStatus {
    NEW,
    PENDING,
    PROCESSING,
    SHIPPING,
    COMPLETED,
    CANCELLED,
    FAILED,
    RETURNED;

    public static OrderStatus parse(String value) {
        if (value == null || value.isBlank()) {
            throw new InvalidDomainStateException("Order status is required");
        }
        try {
            return OrderStatus.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new InvalidDomainStateException("Invalid order status", ex);
        }
    }
}
