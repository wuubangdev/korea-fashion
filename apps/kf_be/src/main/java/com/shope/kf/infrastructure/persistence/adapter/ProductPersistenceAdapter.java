package com.shope.kf.infrastructure.persistence.adapter;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.common.ProductFilter;
import com.shope.kf.application.port.out.ProductPersistencePort;
import com.shope.kf.domain.model.Product;
import com.shope.kf.infrastructure.persistence.jpa.ProductJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.mapper.PageMapper;
import com.shope.kf.infrastructure.persistence.jpa.mapper.ProductMapper;
import com.shope.kf.infrastructure.persistence.repository.ProductJpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Optional;

@Component
public class ProductPersistenceAdapter implements ProductPersistencePort {

    private final ProductJpaRepository repo;

    public ProductPersistenceAdapter(ProductJpaRepository repo) {
        this.repo = repo;
    }

    @Override
    public Product save(Product product) {
        ProductJpaEntity entity = ProductMapper.toEntity(product);
        if (product.getId() != null) {
            repo.findById(product.getId()).ifPresent(existing -> {
                entity.setVersion(existing.getVersion());
                entity.setCreatedAt(existing.getCreatedAt());
                entity.setCreatedBy(existing.getCreatedBy());
                entity.setDeletedAt(existing.getDeletedAt());
                entity.setDeletedBy(existing.getDeletedBy());
            });
        }
        ProductJpaEntity saved = repo.save(entity);
        return ProductMapper.toDomain(saved);
    }

    @Override
    public Optional<Product> findById(Long id) {
        return repo.findById(id).map(ProductMapper::toDomain);
    }

    @Override
    public void deleteById(Long id) {
        repo.findById(id).ifPresent(product -> {
            product.markDeleted("system");
            repo.save(product);
        });
    }

    @Override
    public void hardDeleteById(Long id) {
        repo.hardDeleteById(id);
    }

    @Override
    public PageResult<Product> findAll(String search, PageQuery pageQuery) {
        var pageable = PageMapper.toPageable(pageQuery);
        Page<ProductJpaEntity> page = (search == null || search.isBlank()) ? repo.findAll(pageable) : repo.findByNameContainingIgnoreCase(search, pageable);
        return PageMapper.toResult(page, ProductMapper::toDomain);
    }

    @Override
    public PageResult<Product> findAll(ProductFilter filter, PageQuery pageQuery) {
        var pageable = PageMapper.toPageable(pageQuery);
        Page<ProductJpaEntity> page = repo.findAll(toSpecification(filter), pageable);
        return PageMapper.toResult(page, ProductMapper::toDomain);
    }

    private Specification<ProductJpaEntity> toSpecification(ProductFilter filter) {
        return (root, query, cb) -> {
            var predicates = new ArrayList<jakarta.persistence.criteria.Predicate>();
            if (filter == null) {
                return cb.conjunction();
            }
            if (hasText(filter.search())) {
                String value = "%" + filter.search().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), value),
                        cb.like(cb.lower(root.get("description")), value),
                        cb.like(cb.lower(root.get("brand")), value),
                        cb.like(cb.lower(root.get("tags")), value)
                ));
            }
            if (filter.categoryId() != null) {
                predicates.add(cb.equal(root.get("categoryId"), filter.categoryId()));
            }
            if (hasText(filter.brand())) {
                predicates.add(cb.equal(cb.lower(root.get("brand")), filter.brand().toLowerCase()));
            }
            if (hasText(filter.brandId())) {
                predicates.add(cb.equal(root.get("brandId"), filter.brandId()));
            }
            if (hasText(filter.collectionId())) {
                predicates.add(cb.equal(root.get("collectionId"), filter.collectionId()));
            }
            if (hasText(filter.gender())) {
                predicates.add(cb.equal(cb.lower(root.get("gender")), filter.gender().toLowerCase()));
            }
            if (hasText(filter.style())) {
                predicates.add(cb.equal(cb.lower(root.get("style")), filter.style().toLowerCase()));
            }
            if (hasText(filter.season())) {
                predicates.add(cb.equal(cb.lower(root.get("season")), filter.season().toLowerCase()));
            }
            if (filter.priceMin() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), filter.priceMin()));
            }
            if (filter.priceMax() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), filter.priceMax()));
            }
            if (hasText(filter.status())) {
                predicates.add(cb.equal(cb.lower(root.get("status")), filter.status().toLowerCase()));
            }
            if (Boolean.TRUE.equals(filter.inStock())) {
                predicates.add(cb.greaterThan(root.get("stockQuantity"), 0));
            }
            if (Boolean.FALSE.equals(filter.inStock())) {
                predicates.add(cb.or(cb.isNull(root.get("stockQuantity")), cb.lessThanOrEqualTo(root.get("stockQuantity"), 0)));
            }
            if (filter.featured() != null) {
                predicates.add(cb.equal(root.get("featured"), filter.featured()));
            }
            if (filter.newArrival() != null) {
                predicates.add(cb.equal(root.get("newArrival"), filter.newArrival()));
            }
            if (filter.bestSeller() != null) {
                predicates.add(cb.equal(root.get("bestSeller"), filter.bestSeller()));
            }
            if (filter.sale() != null) {
                predicates.add(cb.equal(root.get("sale"), filter.sale()));
            }
            return cb.and(predicates.toArray(jakarta.persistence.criteria.Predicate[]::new));
        };
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
