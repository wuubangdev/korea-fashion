package com.shope.kf.infrastructure.api.mapper;

import com.shope.kf.application.dto.request.CreateVariantRequest;
import com.shope.kf.application.dto.request.UpdateVariantRequest;
import com.shope.kf.application.dto.response.VariantResponse;
import com.shope.kf.domain.model.Variant;

public final class VariantApiMapper {
    private VariantApiMapper() {
    }

    public static Variant toDomain(CreateVariantRequest request) {
        return Variant.builder()
                .productId(request.getProductId())
                .sku(request.getSku())
                .quantity(request.getQuantity())
                .price(request.getPrice())
                .size(request.getSize())
                .color(request.getColor())
                .build();
    }

    public static Variant toDomain(UpdateVariantRequest request) {
        return Variant.builder()
                .productId(request.getProductId())
                .sku(request.getSku())
                .quantity(request.getQuantity())
                .price(request.getPrice())
                .size(request.getSize())
                .color(request.getColor())
                .build();
    }

    public static VariantResponse toResponse(Variant variant) {
        return VariantResponse.builder()
                .id(variant.getId())
                .productId(variant.getProductId())
                .sku(variant.getSku())
                .quantity(variant.getQuantity())
                .price(variant.getPrice())
                .size(variant.getSize())
                .color(variant.getColor())
                .build();
    }
}
