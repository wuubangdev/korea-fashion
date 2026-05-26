package com.shope.kf.infrastructure.api.mapper;

import com.shope.kf.infrastructure.api.dto.request.CreateCategoryRequest;
import com.shope.kf.infrastructure.api.dto.request.UpdateCategoryRequest;
import com.shope.kf.infrastructure.api.dto.response.CategoryResponse;
import com.shope.kf.domain.model.Category;

public final class CategoryApiMapper {
    private CategoryApiMapper() {
    }

    public static Category toDomain(CreateCategoryRequest request) {
        return Category.builder()
                .code(request.getCode())
                .name(request.getName())
                .description(request.getDescription())
                .build();
    }

    public static Category toDomain(UpdateCategoryRequest request) {
        return Category.builder()
                .code(request.getCode())
                .name(request.getName())
                .description(request.getDescription())
                .build();
    }

    public static CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .code(category.getCode())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }
}
