package com.shope.kf.infrastructure.api.mapper;

import com.shope.kf.infrastructure.api.dto.request.CreateProductRequest;
import com.shope.kf.infrastructure.api.dto.request.UpdateProductRequest;
import com.shope.kf.infrastructure.api.dto.response.ProductResponse;
import com.shope.kf.domain.model.Product;

public final class ProductApiMapper {
    private ProductApiMapper() {
    }

    public static Product toDomain(CreateProductRequest request) {
        return Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .price(request.getPrice())
                .brand(request.getBrand())
                .origin(request.getOrigin())
                .build();
    }

    public static Product toDomain(UpdateProductRequest request) {
        return Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .price(request.getPrice())
                .brand(request.getBrand())
                .origin(request.getOrigin())
                .build();
    }

    public static ProductResponse toResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .imageUrl(product.getImageUrl())
                .price(product.getPrice())
                .brand(product.getBrand())
                .origin(product.getOrigin())
                .build();
    }
}
