package com.shope.kf.application.port.out;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.domain.model.Category;

import java.util.Optional;

public interface CategoryPersistencePort {
    Category save(Category category);
    Optional<Category> findById(Long id);
    void deleteById(Long id);
    void hardDeleteById(Long id);
    PageResult<Category> findAll(String search, PageQuery pageQuery);
}
