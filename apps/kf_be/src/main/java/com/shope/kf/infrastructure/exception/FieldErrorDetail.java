package com.shope.kf.infrastructure.exception;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Chi tiết lỗi validation của từng field.")
public record FieldErrorDetail(
        @Schema(description = "Tên field bị lỗi.", example = "name")
        String field,
        @Schema(description = "Thông báo lỗi tương ứng.", example = "must not be blank")
        String message
) {
}
