package com.shope.kf.infrastructure.persistence.jpa.mapper;

import com.shope.kf.domain.model.Category;
import com.shope.kf.infrastructure.persistence.jpa.CategoryJpaEntity;

public final class CategoryMapper {
    private CategoryMapper() {
    }

    public static Category toDomain(CategoryJpaEntity entity) {
        if (entity == null) {
            return null;
        }
        return Category.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .name(entity.getName())
                .description(entity.getDescription())
                .build();
    }

    public static CategoryJpaEntity toEntity(Category category) {
        if (category == null) {
            return null;
        }
        CategoryJpaEntity entity = new CategoryJpaEntity();
        entity.setId(category.getId());
        entity.setCode(category.getCode());
        entity.setName(category.getName());
        entity.setDescription(category.getDescription());
        return entity;
    }
}
