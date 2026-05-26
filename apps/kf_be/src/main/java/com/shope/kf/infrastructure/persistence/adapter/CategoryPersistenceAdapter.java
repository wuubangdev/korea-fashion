package com.shope.kf.infrastructure.persistence.adapter;

import com.shope.kf.application.port.out.CategoryPersistencePort;
import com.shope.kf.domain.model.Category;
import com.shope.kf.infrastructure.persistence.jpa.CategoryJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.mapper.CategoryMapper;
import com.shope.kf.infrastructure.persistence.repository.CategoryJpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class CategoryPersistenceAdapter implements CategoryPersistencePort {

    private final CategoryJpaRepository repo;

    public CategoryPersistenceAdapter(CategoryJpaRepository repo) {
        this.repo = repo;
    }

    @Override
    public Category save(Category category) {
        CategoryJpaEntity e = CategoryMapper.toEntity(category);
        CategoryJpaEntity saved = repo.save(e);
        return CategoryMapper.toDomain(saved);
    }

    @Override
    public Optional<Category> findById(Long id) {
        return repo.findById(id).map(CategoryMapper::toDomain);
    }

    @Override
    public void deleteById(Long id) {
        repo.deleteById(id);
    }

    @Override
    public Page<Category> findAll(String search, Pageable pageable) {
        Page<CategoryJpaEntity> page = (search == null || search.isBlank()) ? repo.findAll(pageable) : repo.findByNameContainingIgnoreCase(search, pageable);
        return page.map(CategoryMapper::toDomain);
    }
}
