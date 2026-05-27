package com.shope.kf.infrastructure.api.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;

@Schema(description = "Định dạng response thành công chuẩn của backend.")
public record ApiResponse<T>(
        @Schema(description = "Luôn là true khi request thành công.", example = "true")
        boolean success,
        @Schema(description = "Thông báo ngắn cho frontend.", example = "OK")
        String message,
        @Schema(description = "Dữ liệu nghiệp vụ trả về.")
        T data,
        @Schema(description = "Thời điểm backend tạo response.")
        Instant timestamp
) {
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, "OK", data, Instant.now());
    }

    public static <T> ApiResponse<T> ok(String message, T data) {
        return new ApiResponse<>(true, message, data, Instant.now());
    }
}
