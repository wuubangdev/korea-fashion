package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.ProductTagJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ProductTagJpaRepository extends JpaRepository<ProductTagJpaEntity, String>, JpaSpecificationExecutor<ProductTagJpaEntity> {
    List<ProductTagJpaEntity> findByActiveTrueOrderByDisplayOrderAscIdAsc();
}
