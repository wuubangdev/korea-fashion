package com.shope.kf.application.service;

import com.shope.kf.domain.model.FulfillmentStatus;
import com.shope.kf.domain.model.GenericStatus;
import com.shope.kf.domain.model.OrderShippingStatus;
import com.shope.kf.domain.model.PaymentStatus;

import java.lang.reflect.Field;

public class GenericStatusValidator<T> implements GenericCrudValidator<T> {
    @Override
    public void validateForCreate(T body) {
        validate(body);
    }

    @Override
    public void validateForUpdate(T body) {
        validate(body);
    }

    private void validate(T body) {
        if (body == null) {
            return;
        }
        Class<?> type = body.getClass();
        while (type != null) {
            for (Field field : type.getDeclaredFields()) {
                validateField(body, field);
            }
            type = type.getSuperclass();
        }
    }

    private void validateField(T body, Field field) {
        if (!String.class.equals(field.getType())) {
            return;
        }
        String fieldName = field.getName();
        if (!isKnownStatusField(fieldName)) {
            return;
        }
        try {
            field.setAccessible(true);
            String value = (String) field.get(body);
            if (value == null || value.isBlank()) {
                return;
            }
            String normalized = normalize(fieldName, value);
            field.set(body, normalized);
        } catch (IllegalAccessException ex) {
            throw new IllegalStateException("Cannot validate status field", ex);
        }
    }

    private boolean isKnownStatusField(String fieldName) {
        return "status".equals(fieldName)
                || "paymentStatus".equals(fieldName)
                || "fulfillmentStatus".equals(fieldName)
                || "shippingStatus".equals(fieldName);
    }

    private String normalize(String fieldName, String value) {
        return switch (fieldName) {
            case "paymentStatus" -> PaymentStatus.parse(value).name();
            case "fulfillmentStatus" -> FulfillmentStatus.parse(value).name();
            case "shippingStatus" -> OrderShippingStatus.parse(value).name();
            default -> normalizeGenericStatus(value);
        };
    }

    private String normalizeGenericStatus(String value) {
        return GenericStatus.parse(value).name();
    }
}
