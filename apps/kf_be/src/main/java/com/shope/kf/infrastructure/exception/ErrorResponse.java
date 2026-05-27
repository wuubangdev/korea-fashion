package com.shope.kf.infrastructure.exception;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.List;

@Schema(description = "Định dạng response lỗi chuẩn của backend.")
public record ErrorResponse(
        @Schema(description = "Luôn là false khi request thất bại.", example = "false")
        boolean success,
        @Schema(description = "Mã lỗi ổn định để frontend xử lý.", example = "VALIDATION_ERROR")
        String code,
        @Schema(description = "HTTP status code.", example = "400")
        int status,
        @Schema(description = "Thông báo lỗi có thể hiển thị hoặc log.", example = "Dữ liệu không hợp lệ")
        String message,
        @Schema(description = "Path API phát sinh lỗi.", example = "/api/products")
        String path,
        @Schema(description = "Thời điểm backend tạo response lỗi.")
        Instant timestamp,
        @Schema(description = "Danh sách lỗi từng field, chỉ có khi validation thất bại.")
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
