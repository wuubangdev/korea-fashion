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

    private String barcode;

    @NotNull
    @PositiveOrZero
    private Integer quantity;
    private Integer reservedQuantity;
    private Integer availableQuantity;
    private Integer lowStockThreshold;

    @NotNull
    private BigDecimal price;

    private BigDecimal compareAtPrice;
    private BigDecimal costPrice;
    private String sizeId;
    private String size;
    private String colorId;
    private String color;
    private String colorHex;
    private BigDecimal weight;
    private String imageUrl;
    private Boolean active;
}
