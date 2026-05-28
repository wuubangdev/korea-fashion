package com.shope.kf.domain.exception;

public class UserNotFoundException extends DomainException {
    private final String identifier;

    public UserNotFoundException(String identifier) {
        super("USER_NOT_FOUND", "User not found: " + identifier);
        this.identifier = identifier;
    }

    public String getIdentifier() {
        return identifier;
    }
}
