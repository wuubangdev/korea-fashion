package com.shope.kf.domain.model;

import com.shope.kf.domain.exception.InvalidDomainStateException;

import java.util.Locale;

public enum GenericStatus {
    DRAFT,
    ACTIVE,
    INACTIVE,
    PUBLISHED,
    ARCHIVED,
    NEW,
    PENDING,
    ASSIGNED,
    APPROVED,
    REJECTED,
    PROCESSING,
    COMPLETED,
    CANCELLED,
    FAILED,
    UNPAID,
    PAID,
    REFUNDED,
    UNFULFILLED,
    FULFILLED,
    SHIPPING,
    SHIPPED,
    DELIVERED,
    RETURNED;

    public static GenericStatus parse(String value) {
        if (value == null || value.isBlank()) {
            throw new InvalidDomainStateException("Status is required");
        }
        try {
            return GenericStatus.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new InvalidDomainStateException("Invalid status", ex);
        }
    }
}
