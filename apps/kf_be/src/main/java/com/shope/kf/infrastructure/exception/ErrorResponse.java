package com.shope.kf.infrastructure.exception;

import java.time.Instant;
import java.util.List;

public record ErrorResponse(
        boolean success,
        String code,
        int status,
        String message,
        String path,
        Instant timestamp,
        List<FieldErrorDetail> errors
) {
    public static ErrorResponse of(ErrorCode errorCode, String message, String path) {
        return new ErrorResponse(
                false,
                errorCode.code(),
                errorCode.status().value(),
                message == null || message.isBlank() ? errorCode.defaultMessage() : message,
                path,
                Instant.now(),
                List.of()
        );
    }

    public static ErrorResponse validation(String path, List<FieldErrorDetail> errors) {
        return new ErrorResponse(
                false,
                ErrorCode.VALIDATION_ERROR.code(),
                ErrorCode.VALIDATION_ERROR.status().value(),
                ErrorCode.VALIDATION_ERROR.defaultMessage(),
                path,
                Instant.now(),
                errors
        );
    }
}
