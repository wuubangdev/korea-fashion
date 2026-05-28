package com.shope.kf.application.service;

public interface GenericCrudValidator<T> {
    void validateForCreate(T body);

    void validateForUpdate(T body);

    static <T> GenericCrudValidator<T> noop() {
        return new GenericCrudValidator<>() {
            @Override
            public void validateForCreate(T body) {
            }

            @Override
            public void validateForUpdate(T body) {
            }
        };
    }
}
