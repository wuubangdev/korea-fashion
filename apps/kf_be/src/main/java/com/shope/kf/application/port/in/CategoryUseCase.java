package com.shope.kf.application.port.in;

import com.shope.kf.domain.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CategoryUseCase {
    Category create(Category category);
    Category update(Long id, Category category);
    void delete(Long id);
    Category findById(Long id);
    Page<Category> list(String search, Pageable pageable);
}
