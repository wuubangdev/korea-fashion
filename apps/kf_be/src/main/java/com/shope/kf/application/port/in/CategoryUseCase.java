package com.shope.kf.application.port.in;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.domain.model.Category;

import java.util.List;

public interface CategoryUseCase {
    Category create(Category category);
    Category copy(Long id);
    Category update(Long id, Category category);
    void delete(Long id);
    void deleteAll(List<Long> ids);
    void restore(Long id);
    void restoreAll(List<Long> ids);
    void hardDelete(Long id);
    void hardDeleteAll(List<Long> ids);
    Category findById(Long id);
    PageResult<Category> list(String search, PageQuery pageQuery);
    PageResult<Category> trash(String search, PageQuery pageQuery);
}
