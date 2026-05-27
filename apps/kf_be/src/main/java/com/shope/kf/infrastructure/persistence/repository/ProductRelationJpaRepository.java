package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.ProductRelationJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ProductRelationJpaRepository extends JpaRepository<ProductRelationJpaEntity, Long>, JpaSpecificationExecutor<ProductRelationJpaEntity> {
    List<ProductRelationJpaEntity> findByProductIdAndActiveTrueOrderByDisplayOrderAscIdAsc(Long productId);
    List<ProductRelationJpaEntity> findByProductIdAndRelationTypeAndActiveTrueOrderByDisplayOrderAscIdAsc(Long productId, String relationType);
}
