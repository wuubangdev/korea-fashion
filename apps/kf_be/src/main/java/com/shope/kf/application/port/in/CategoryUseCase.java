package com.shope.kf.application.port.in;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.domain.model.Category;

public interface CategoryUseCase {
    Category create(Category category);
    Category update(Long id, Category category);
    void delete(Long id);
    void hardDelete(Long id);
    Category findById(Long id);
    PageResult<Category> list(String search, PageQuery pageQuery);
}
