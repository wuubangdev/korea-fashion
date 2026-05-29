package com.shope.kf.infrastructure.persistence.adapter;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.infrastructure.persistence.jpa.BaseJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.mapper.PageMapper;
import jakarta.persistence.Id;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Optional;

public class GenericJpaCrudAdapter<T, ID, R extends JpaRepository<T, ID> & JpaSpecificationExecutor<T>>
        implements GenericCrudUseCase<T, ID> {
    private final R repository;
    private final Class<T> entityClass;
    private final TrashQuerySupport trashQuerySupport;

    public GenericJpaCrudAdapter(R repository, Class<T> entityClass, TrashQuerySupport trashQuerySupport) {
        this.repository = repository;
        this.entityClass = entityClass;
        this.trashQuerySupport = trashQuerySupport;
    }

    @Override
    public T create(T body) {
        return repository.save(body);
    }

    @Override
    public PageResult<T> list(String search, PageQuery pageQuery) {
        var pageable = PageMapper.toPageable(pageQuery);
        var page = (search == null || search.isBlank())
                ? repository.findAll(pageable)
                : repository.findAll(containsText(search), pageable);
        return PageMapper.toResult(page, item -> item);
    }

    @Override
    public PageResult<T> listDeleted(String search, PageQuery pageQuery) {
        return trashQuerySupport.listDeleted(entityClass, search, pageQuery);
    }

    @Override
    public Optional<T> findById(ID id) {
        return repository.findById(id);
    }

    @Override
    public Optional<T> update(ID id, T body) {
        Optional<T> existing = repository.findById(id);
        if (existing.isEmpty()) {
            return Optional.empty();
        }
        setId(body, id);
        if (existing.get() instanceof BaseJpaEntity source && body instanceof BaseJpaEntity target) {
            JpaAuditMetadata.copyVersionAndAudit(source, target);
        }
        return Optional.of(repository.save(body));
    }

    @Override
    public boolean delete(ID id) {
        Optional<T> entity = repository.findById(id);
        if (entity.isEmpty()) {
            return false;
        }
        T value = entity.get();
        if (value instanceof BaseJpaEntity auditable) {
            auditable.markDeleted("system");
            repository.save(value);
            return true;
        }
        repository.deleteById(id);
        return true;
    }

    @Override
    public boolean restore(ID id) {
        return trashQuerySupport.restore(entityClass, id);
    }

    @Override
    public int restoreAll(List<ID> ids) {
        return trashQuerySupport.restoreAll(entityClass, ids);
    }

    @Override
    public boolean hardDelete(ID id) {
        if (BaseJpaEntity.class.isAssignableFrom(entityClass)) {
            return trashQuerySupport.hardDelete(entityClass, id);
        }
        try {
            repository.deleteById(id);
            return true;
        } catch (EmptyResultDataAccessException ex) {
            return false;
        }
    }

    private Specification<T> containsText(String search) {
        return (root, query, cb) -> {
            String value = "%" + search.toLowerCase() + "%";
            List<jakarta.persistence.criteria.Predicate> predicates = java.util.Arrays.stream(root.getJavaType().getDeclaredFields())
                    .filter(field -> field.getType().equals(String.class))
                    .map(field -> cb.like(cb.lower(root.get(field.getName())), value))
                    .toList();
            if (predicates.isEmpty()) {
                return cb.conjunction();
            }
            return cb.or(predicates.toArray(jakarta.persistence.criteria.Predicate[]::new));
        };
    }

    private void setId(T body, ID id) {
        Class<?> type = body.getClass();
        while (type != null) {
            for (Field field : type.getDeclaredFields()) {
                if (field.isAnnotationPresent(Id.class)) {
                    try {
                        field.setAccessible(true);
                        field.set(body, id);
                        return;
                    } catch (IllegalAccessException ex) {
                        throw new IllegalStateException("Cannot set id field", ex);
                    }
                }
            }
            type = type.getSuperclass();
        }
        throw new IllegalStateException("Entity id field not found");
    }
}
