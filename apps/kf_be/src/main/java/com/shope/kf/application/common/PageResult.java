package com.shope.kf.application.common;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;
import java.util.function.Function;

@Schema(description = "Định dạng dữ liệu phân trang chuẩn.")
public record PageResult<T>(
        @Schema(description = "Danh sách item của trang hiện tại.")
        List<T> content,
        @Schema(description = "Số trang hiện tại, bắt đầu từ 0.", example = "0")
        int page,
        @Schema(description = "Số item mỗi trang.", example = "10")
        int size,
        @Schema(description = "Tổng số item thỏa điều kiện lọc.", example = "125")
        long totalElements,
        @Schema(description = "Tổng số trang.", example = "13")
        int totalPages
) {
    public <R> PageResult<R> map(Function<T, R> mapper) {
        return new PageResult<>(
                content.stream().map(mapper).toList(),
                page,
                size,
                totalElements,
                totalPages
        );
    }
}
