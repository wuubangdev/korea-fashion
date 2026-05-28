package com.shope.kf.infrastructure.persistence.adapter;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.out.CategoryPersistencePort;
import com.shope.kf.domain.model.Category;
import com.shope.kf.infrastructure.persistence.jpa.CategoryJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.mapper.CategoryMapper;
import com.shope.kf.infrastructure.persistence.jpa.mapper.PageMapper;
import com.shope.kf.infrastructure.persistence.repository.CategoryJpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;
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
        if (category.getId() != null) {
            repo.findById(category.getId()).ifPresent(existing -> JpaAuditMetadata.copyVersionAndAudit(existing, e));
        }
        CategoryJpaEntity saved = repo.save(e);
        return CategoryMapper.toDomain(saved);
    }

    @Override
    public Optional<Category> findById(Long id) {
        return repo.findById(id).map(CategoryMapper::toDomain);
    }

    @Override
    public void deleteById(Long id) {
        repo.findById(id).ifPresent(category -> {
            category.markDeleted("system");
            repo.save(category);
        });
    }

    @Override
    public void deleteAllById(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }
        repo.findAllById(ids).forEach(category -> {
            category.markDeleted("system");
            repo.save(category);
        });
    }

    @Override
    public void hardDeleteById(Long id) {
        repo.hardDeleteById(id);
    }

    @Override
    public void hardDeleteAllById(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }
        repo.hardDeleteByIdIn(ids);
    }

    @Override
    public PageResult<Category> findAll(String search, PageQuery pageQuery) {
        var pageable = PageMapper.toPageable(pageQuery);
        Page<CategoryJpaEntity> page = (search == null || search.isBlank()) ? repo.findAll(pageable) : repo.findByNameContainingIgnoreCase(search, pageable);
        return PageMapper.toResult(page, CategoryMapper::toDomain);
    }
}
