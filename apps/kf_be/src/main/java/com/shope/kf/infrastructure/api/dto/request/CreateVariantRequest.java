package com.shope.kf.infrastructure.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateVariantRequest {
    @NotNull
    private Long productId;

    @NotBlank
    private String sku;

    @NotNull
    @PositiveOrZero
    private Integer quantity;

    @NotNull
    private BigDecimal price;

    private String size;
    private String color;
}
