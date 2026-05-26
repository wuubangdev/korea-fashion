package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.VariantJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VariantJpaRepository extends JpaRepository<VariantJpaEntity, Long> {
    Page<VariantJpaEntity> findBySkuContainingIgnoreCase(String sku, Pageable pageable);
    Page<VariantJpaEntity> findByProductId(Long productId, Pageable pageable);
}
