package com.shope.kf.domain.exception;

public class InvalidProductException extends DomainException {
    public InvalidProductException(String message) {
        super("INVALID_PRODUCT", message);
    }
}
