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

    public boolean isTerminal() {
        return this == DELIVERED || isTerminalFailure();
    }

    public boolean canTransitionTo(OrderShippingStatus next) {
        if (next == null) {
            return false;
        }
        if (this == next) {
            return true;
        }
        return switch (this) {
            case PENDING -> next == ASSIGNED || next == CANCELLED;
            case ASSIGNED -> next == SHIPPING || next == CANCELLED || next == FAILED;
            case SHIPPING -> next == DELIVERED || next == CANCELLED || next == FAILED;
            case DELIVERED, FAILED, CANCELLED -> false;
        };
    }
}
