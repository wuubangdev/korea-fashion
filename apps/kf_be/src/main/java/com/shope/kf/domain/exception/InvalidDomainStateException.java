package com.shope.kf.domain.exception;

public class InvalidDomainStateException extends DomainException {
    public InvalidDomainStateException(String message) {
        super("INVALID_DOMAIN_STATE", message);
    }

    public InvalidDomainStateException(String message, Throwable cause) {
        super("INVALID_DOMAIN_STATE", message, cause);
    }
}
