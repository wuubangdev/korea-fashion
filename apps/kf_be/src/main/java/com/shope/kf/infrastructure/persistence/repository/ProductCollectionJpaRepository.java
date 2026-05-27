package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.ProductCollectionJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ProductCollectionJpaRepository extends JpaRepository<ProductCollectionJpaEntity, String>, JpaSpecificationExecutor<ProductCollectionJpaEntity> {
    List<ProductCollectionJpaEntity> findByActiveTrueOrderByDisplayOrderAscIdAsc();
}
