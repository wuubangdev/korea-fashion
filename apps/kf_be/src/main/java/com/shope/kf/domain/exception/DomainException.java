package com.shope.kf.domain.exception;

public class DomainException extends RuntimeException {
    private final String errorKey;

    public DomainException(String errorKey, String message) {
        super(message);
        this.errorKey = errorKey;
    }

    public DomainException(String errorKey, String message, Throwable cause) {
        super(message, cause);
        this.errorKey = errorKey;
    }

    public String getErrorKey() {
        return errorKey;
    }
}
