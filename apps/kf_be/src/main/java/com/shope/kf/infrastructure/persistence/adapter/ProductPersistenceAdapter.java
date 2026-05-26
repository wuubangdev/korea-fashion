package com.shope.kf.infrastructure.persistence.adapter;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.out.ProductPersistencePort;
import com.shope.kf.domain.model.Product;
import com.shope.kf.infrastructure.persistence.jpa.ProductJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.mapper.PageMapper;
import com.shope.kf.infrastructure.persistence.jpa.mapper.ProductMapper;
import com.shope.kf.infrastructure.persistence.repository.ProductJpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ProductPersistenceAdapter implements ProductPersistencePort {

    private final ProductJpaRepository repo;

    public ProductPersistenceAdapter(ProductJpaRepository repo) {
        this.repo = repo;
    }

    @Override
    public Product save(Product product) {
        ProductJpaEntity e = ProductMapper.toEntity(product);
        ProductJpaEntity saved = repo.save(e);
        return ProductMapper.toDomain(saved);
    }

    @Override
    public Optional<Product> findById(Long id) {
        return repo.findById(id).map(ProductMapper::toDomain);
    }

    @Override
    public void deleteById(Long id) {
        repo.deleteById(id);
    }

    @Override
    public PageResult<Product> findAll(String search, PageQuery pageQuery) {
        var pageable = PageMapper.toPageable(pageQuery);
        Page<ProductJpaEntity> page = (search == null || search.isBlank()) ? repo.findAll(pageable) : repo.findByNameContainingIgnoreCase(search, pageable);
        return PageMapper.toResult(page, ProductMapper::toDomain);
    }
}
