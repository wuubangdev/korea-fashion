package com.shope.kf.application.service;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.in.CategoryUseCase;
import com.shope.kf.application.port.out.CategoryPersistencePort;
import com.shope.kf.domain.model.Category;

public class CategoryService implements CategoryUseCase {

    private final CategoryPersistencePort port;

    public CategoryService(CategoryPersistencePort port) {
        this.port = port;
    }

    @Override
    public Category create(Category category) {
        return port.save(category);
    }

    @Override
    public Category update(Long id, Category category) {
        category.setId(id);
        return port.save(category);
    }

    @Override
    public void delete(Long id) {
        port.deleteById(id);
    }

    @Override
    public Category findById(Long id) {
        return port.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
    }

    @Override
    public PageResult<Category> list(String search, PageQuery pageQuery) {
        return port.findAll(search, pageQuery);
    }
}
