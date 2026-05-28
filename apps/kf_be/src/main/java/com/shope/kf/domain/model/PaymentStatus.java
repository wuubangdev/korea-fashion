package com.shope.kf.domain.model;

import com.shope.kf.domain.exception.InvalidDomainStateException;

import java.util.Locale;

public enum PaymentStatus {
    UNPAID,
    PENDING,
    PAID,
    FAILED,
    REFUNDED,
    CANCELLED;

    public static PaymentStatus parse(String value) {
        if (value == null || value.isBlank()) {
            throw new InvalidDomainStateException("Payment status is required");
        }
        try {
            return PaymentStatus.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new InvalidDomainStateException("Invalid payment status", ex);
        }
    }
}
