package com.shope.kf.domain.model;

import com.shope.kf.domain.exception.InvalidDomainStateException;

import java.util.Locale;

public enum FulfillmentStatus {
    UNFULFILLED,
    PROCESSING,
    FULFILLED,
    SHIPPING,
    SHIPPED,
    DELIVERED,
    CANCELLED,
    RETURNED;

    public static FulfillmentStatus parse(String value) {
        if (value == null || value.isBlank()) {
            throw new InvalidDomainStateException("Fulfillment status is required");
        }
        try {
            return FulfillmentStatus.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new InvalidDomainStateException("Invalid fulfillment status", ex);
        }
    }
}
