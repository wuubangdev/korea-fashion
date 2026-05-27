package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.ProductImageJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ProductImageJpaRepository extends JpaRepository<ProductImageJpaEntity, Long>, JpaSpecificationExecutor<ProductImageJpaEntity> {
    List<ProductImageJpaEntity> findByProductIdAndActiveTrueOrderByDisplayOrderAscIdAsc(Long productId);
}
