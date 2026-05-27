package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.ProductOptionJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ProductOptionJpaRepository extends JpaRepository<ProductOptionJpaEntity, Long>, JpaSpecificationExecutor<ProductOptionJpaEntity> {
    List<ProductOptionJpaEntity> findByProductIdAndActiveTrueOrderByDisplayOrderAscIdAsc(Long productId);
}
