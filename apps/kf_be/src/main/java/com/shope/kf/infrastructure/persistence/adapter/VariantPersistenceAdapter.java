package com.shope.kf.infrastructure.persistence.adapter;

import com.shope.kf.application.port.out.VariantPersistencePort;
import com.shope.kf.domain.model.Variant;
import com.shope.kf.infrastructure.persistence.jpa.VariantJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.mapper.VariantMapper;
import com.shope.kf.infrastructure.persistence.repository.VariantJpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class VariantPersistenceAdapter implements VariantPersistencePort {

    private final VariantJpaRepository repo;

    public VariantPersistenceAdapter(VariantJpaRepository repo) {
        this.repo = repo;
    }

    @Override
    public Variant save(Variant variant) {
        VariantJpaEntity e = VariantMapper.toEntity(variant);
        VariantJpaEntity saved = repo.save(e);
        return VariantMapper.toDomain(saved);
    }

    @Override
    public Optional<Variant> findById(Long id) {
        return repo.findById(id).map(VariantMapper::toDomain);
    }

    @Override
    public void deleteById(Long id) {
        repo.deleteById(id);
    }

    @Override
    public Page<Variant> findAll(String search, Pageable pageable) {
        Page<VariantJpaEntity> page = (search == null || search.isBlank()) ? repo.findAll(pageable) : repo.findBySkuContainingIgnoreCase(search, pageable);
        return page.map(VariantMapper::toDomain);
    }

    @Override
    public Page<Variant> findByProduct(Long productId, Pageable pageable) {
        return repo.findByProductId(productId, pageable).map(VariantMapper::toDomain);
    }
}
