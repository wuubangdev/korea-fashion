package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.ProductAttributeJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ProductAttributeJpaRepository extends JpaRepository<ProductAttributeJpaEntity, Long>, JpaSpecificationExecutor<ProductAttributeJpaEntity> {
    List<ProductAttributeJpaEntity> findByProductIdAndVisibleTrueOrderByDisplayOrderAscIdAsc(Long productId);
}
