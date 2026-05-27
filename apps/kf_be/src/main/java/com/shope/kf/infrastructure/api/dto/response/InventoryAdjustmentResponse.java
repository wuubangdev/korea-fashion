package com.shope.kf.infrastructure.api.dto.response;

public record InventoryAdjustmentResponse(
        Long variantId,
        Integer quantity,
        Integer reservedQuantity,
        Integer availableQuantity,
        Long transactionId
) {
}
