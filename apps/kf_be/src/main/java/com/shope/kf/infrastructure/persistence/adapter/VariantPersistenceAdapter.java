package com.shope.kf.infrastructure.persistence.adapter;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.out.VariantPersistencePort;
import com.shope.kf.domain.model.Variant;
import com.shope.kf.infrastructure.persistence.jpa.VariantJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.mapper.PageMapper;
import com.shope.kf.infrastructure.persistence.jpa.mapper.VariantMapper;
import com.shope.kf.infrastructure.persistence.repository.VariantJpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class VariantPersistenceAdapter implements VariantPersistencePort {

    private final VariantJpaRepository repo;
    private final TrashQuerySupport trashQuerySupport;

    public VariantPersistenceAdapter(VariantJpaRepository repo, TrashQuerySupport trashQuerySupport) {
        this.repo = repo;
        this.trashQuerySupport = trashQuerySupport;
    }

    @Override
    public Variant save(Variant variant) {
        VariantJpaEntity e = VariantMapper.toEntity(variant);
        if (variant.getId() != null) {
            repo.findById(variant.getId()).ifPresent(existing -> JpaAuditMetadata.copyVersionAndAudit(existing, e));
        }
        VariantJpaEntity saved = repo.save(e);
        return VariantMapper.toDomain(saved);
    }

    @Override
    public Optional<Variant> findById(Long id) {
        return repo.findById(id).map(VariantMapper::toDomain);
    }

    @Override
    public void deleteById(Long id) {
        repo.findById(id).ifPresent(variant -> {
            variant.markDeleted("system");
            repo.save(variant);
        });
    }

    @Override
    public void deleteAllById(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }
        repo.findAllById(ids).forEach(variant -> {
            variant.markDeleted("system");
            repo.save(variant);
        });
    }

    @Override
    public void restoreById(Long id) {
        trashQuerySupport.restore(VariantJpaEntity.class, id);
    }

    @Override
    public void restoreAllById(List<Long> ids) {
        trashQuerySupport.restoreAll(VariantJpaEntity.class, ids);
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
    public PageResult<Variant> findAll(String search, PageQuery pageQuery) {
        var pageable = PageMapper.toPageable(pageQuery);
        Page<VariantJpaEntity> page = (search == null || search.isBlank()) ? repo.findAll(pageable) : repo.findBySkuContainingIgnoreCase(search, pageable);
        return PageMapper.toResult(page, VariantMapper::toDomain);
    }

    @Override
    public PageResult<Variant> findDeleted(String search, PageQuery pageQuery) {
        return trashQuerySupport.listDeleted(VariantJpaEntity.class, search, pageQuery).map(VariantMapper::toDomain);
    }

    @Override
    public PageResult<Variant> findByProduct(Long productId, PageQuery pageQuery) {
        return PageMapper.toResult(repo.findByProductId(productId, PageMapper.toPageable(pageQuery)), VariantMapper::toDomain);
    }
}
