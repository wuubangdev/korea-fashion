package com.shope.kf.infrastructure.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InventoryAdjustmentRequest {
    @NotNull
    private Long variantId;

    private Long productId;

    @NotBlank
    private String type;

    @NotNull
    private Integer quantity;

    private String referenceType;
    private String referenceId;
    private String note;
}
