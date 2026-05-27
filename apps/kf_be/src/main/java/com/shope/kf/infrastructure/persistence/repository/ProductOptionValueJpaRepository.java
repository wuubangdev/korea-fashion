package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.ProductOptionValueJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ProductOptionValueJpaRepository extends JpaRepository<ProductOptionValueJpaEntity, Long>, JpaSpecificationExecutor<ProductOptionValueJpaEntity> {
    List<ProductOptionValueJpaEntity> findByProductIdAndActiveTrueOrderByDisplayOrderAscIdAsc(Long productId);
    List<ProductOptionValueJpaEntity> findByOptionIdAndActiveTrueOrderByDisplayOrderAscIdAsc(Long optionId);
}
