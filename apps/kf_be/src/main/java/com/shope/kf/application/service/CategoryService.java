package com.shope.kf.application.service;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.in.CategoryUseCase;
import com.shope.kf.application.port.out.CategoryPersistencePort;
import com.shope.kf.domain.model.Category;
import com.shope.kf.infrastructure.exception.AppException;
import com.shope.kf.infrastructure.exception.ErrorCode;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
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
    public Category copy(Long id) {
        Category category = findById(id);
        category.setId(null);
        category.setCode(CopyValue.unique(category.getCode()));
        category.setSlug(CopyValue.unique(category.getSlug()));
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
    public void deleteAll(List<Long> ids) {
        port.deleteAllById(ids);
    }

    @Override
    public void restore(Long id) {
        port.restoreById(id);
    }

    @Override
    public void restoreAll(List<Long> ids) {
        port.restoreAllById(ids);
    }

    @Override
    public void hardDelete(Long id) {
        port.hardDeleteById(id);
    }

    @Override
    public void hardDeleteAll(List<Long> ids) {
        port.hardDeleteAllById(ids);
    }

    @Override
    @Transactional(readOnly = true)
    public Category findById(Long id) {
        return port.findById(id).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Category not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<Category> list(String search, PageQuery pageQuery) {
        return port.findAll(search, pageQuery);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<Category> trash(String search, PageQuery pageQuery) {
        return port.findDeleted(search, pageQuery);
    }
}
