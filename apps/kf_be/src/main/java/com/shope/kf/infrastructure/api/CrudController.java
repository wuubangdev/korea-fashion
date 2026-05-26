package com.shope.kf.infrastructure.api;

import jakarta.persistence.Id;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Field;
import java.util.List;

public abstract class CrudController<T, ID, R extends JpaRepository<T, ID> & JpaSpecificationExecutor<T>> {
    private final R repository;

    protected CrudController(R repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<T> create(@RequestBody T body) {
        return ResponseEntity.ok(repository.save(body));
    }

    @GetMapping
    public ResponseEntity<Page<T>> list(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        String[] sortParts = sort.split(",");
        Sort.Direction direction = Sort.Direction.fromString(sortParts.length > 1 ? sortParts[1] : "desc");
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortParts[0]));
        if (search == null || search.isBlank()) {
            return ResponseEntity.ok(repository.findAll(pageable));
        }
        return ResponseEntity.ok(repository.findAll(containsText(search), pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<T> get(@PathVariable String id) {
        return repository.findById(parseId(id))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<T> update(@PathVariable String id, @RequestBody T body) {
        ID parsedId = parseId(id);
        if (!repository.existsById(parsedId)) {
            return ResponseEntity.notFound().build();
        }
        setId(body, parsedId);
        return ResponseEntity.ok(repository.save(body));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        ID parsedId = parseId(id);
        if (!repository.existsById(parsedId)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(parsedId);
        return ResponseEntity.noContent().build();
    }

    protected abstract ID parseId(String id);

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
