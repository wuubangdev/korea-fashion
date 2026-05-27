package com.shope.kf.infrastructure.api.mapper;

import com.shope.kf.infrastructure.api.dto.request.CreateVariantRequest;
import com.shope.kf.infrastructure.api.dto.request.UpdateVariantRequest;
import com.shope.kf.infrastructure.api.dto.response.VariantResponse;
import com.shope.kf.domain.model.Variant;

public final class VariantApiMapper {
    private VariantApiMapper() {
    }

    public static Variant toDomain(CreateVariantRequest request) {
        return Variant.builder()
                .productId(request.getProductId())
                .sku(request.getSku())
                .barcode(request.getBarcode())
                .quantity(request.getQuantity())
                .reservedQuantity(request.getReservedQuantity())
                .availableQuantity(request.getAvailableQuantity())
                .lowStockThreshold(request.getLowStockThreshold())
                .price(request.getPrice())
                .compareAtPrice(request.getCompareAtPrice())
                .costPrice(request.getCostPrice())
                .sizeId(request.getSizeId())
                .size(request.getSize())
                .colorId(request.getColorId())
                .color(request.getColor())
                .colorHex(request.getColorHex())
                .weight(request.getWeight())
                .imageUrl(request.getImageUrl())
                .active(request.getActive())
                .build();
    }

    public static Variant toDomain(UpdateVariantRequest request) {
        return Variant.builder()
                .productId(request.getProductId())
                .sku(request.getSku())
                .barcode(request.getBarcode())
                .quantity(request.getQuantity())
                .reservedQuantity(request.getReservedQuantity())
                .availableQuantity(request.getAvailableQuantity())
                .lowStockThreshold(request.getLowStockThreshold())
                .price(request.getPrice())
                .compareAtPrice(request.getCompareAtPrice())
                .costPrice(request.getCostPrice())
                .sizeId(request.getSizeId())
                .size(request.getSize())
                .colorId(request.getColorId())
                .color(request.getColor())
                .colorHex(request.getColorHex())
                .weight(request.getWeight())
                .imageUrl(request.getImageUrl())
                .active(request.getActive())
                .build();
    }

    public static VariantResponse toResponse(Variant variant) {
        return VariantResponse.builder()
                .id(variant.getId())
                .productId(variant.getProductId())
                .sku(variant.getSku())
                .barcode(variant.getBarcode())
                .quantity(variant.getQuantity())
                .reservedQuantity(variant.getReservedQuantity())
                .availableQuantity(variant.getAvailableQuantity())
                .lowStockThreshold(variant.getLowStockThreshold())
                .price(variant.getPrice())
                .compareAtPrice(variant.getCompareAtPrice())
                .costPrice(variant.getCostPrice())
                .sizeId(variant.getSizeId())
                .size(variant.getSize())
                .colorId(variant.getColorId())
                .color(variant.getColor())
                .colorHex(variant.getColorHex())
                .weight(variant.getWeight())
                .imageUrl(variant.getImageUrl())
                .active(variant.getActive())
                .build();
    }
}
