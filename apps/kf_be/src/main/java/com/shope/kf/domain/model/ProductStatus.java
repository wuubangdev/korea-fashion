package com.shope.kf.domain.model;

import com.shope.kf.domain.exception.InvalidDomainStateException;

import java.util.Locale;

public enum ProductStatus {
    DRAFT,
    ACTIVE,
    INACTIVE,
    PUBLISHED;

    public static ProductStatus parse(String value) {
        if (value == null || value.isBlank()) {
            throw new InvalidDomainStateException("Product status is required");
        }
        try {
            return ProductStatus.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new InvalidDomainStateException("Invalid product status", ex);
        }
    }
}
