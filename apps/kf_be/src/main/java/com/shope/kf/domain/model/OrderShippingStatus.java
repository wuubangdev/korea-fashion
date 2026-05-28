package com.shope.kf.domain.model;

import com.shope.kf.domain.exception.InvalidDomainStateException;

import java.util.Locale;

public enum OrderShippingStatus {
    PENDING,
    ASSIGNED,
    SHIPPING,
    DELIVERED,
    FAILED,
    CANCELLED;

    public static OrderShippingStatus parse(String value) {
        if (value == null || value.isBlank()) {
            throw new InvalidDomainStateException("Shipping status is required");
        }
        try {
            return OrderShippingStatus.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new InvalidDomainStateException("Invalid shipping status", ex);
        }
    }

    public boolean requiresShipper() {
        return this != PENDING;
    }

    public boolean isTerminalFailure() {
        return this == FAILED || this == CANCELLED;
    }
}
