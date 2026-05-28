package com.shope.kf.infrastructure.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateVariantRequest {
    @NotNull
    private Long productId;

    @NotBlank
    private String sku;

    private String barcode;

    @NotNull
    @PositiveOrZero
    private Integer quantity;
    @PositiveOrZero
    private Integer reservedQuantity;
    @PositiveOrZero
    private Integer availableQuantity;
    @PositiveOrZero
    private Integer lowStockThreshold;

    @NotNull
    @PositiveOrZero
    private BigDecimal price;

    @PositiveOrZero
    private BigDecimal compareAtPrice;
    @PositiveOrZero
    private BigDecimal costPrice;
    private String sizeId;
    private String size;
    private String colorId;
    private String color;
    private String colorHex;
    @PositiveOrZero
    private BigDecimal weight;
    private String imageUrl;
    private Boolean active;
}
