package com.shope.kf.application.service;

final class CopyValue {
    private CopyValue() {
    }

    static String unique(String value) {
        if (value == null || value.isBlank()) {
            return value;
        }
        return value + "-copy-" + System.currentTimeMillis();
    }
}
