package com.shope.kf.domain.model;

import com.shope.kf.domain.exception.InvalidDomainStateException;

import java.util.Locale;

public enum ContentStatus {
    DRAFT,
    ACTIVE,
    INACTIVE,
    PUBLISHED,
    ARCHIVED;

    public static ContentStatus parse(String value) {
        if (value == null || value.isBlank()) {
            throw new InvalidDomainStateException("Content status is required");
        }
        try {
            return ContentStatus.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new InvalidDomainStateException("Invalid content status", ex);
        }
    }
}
