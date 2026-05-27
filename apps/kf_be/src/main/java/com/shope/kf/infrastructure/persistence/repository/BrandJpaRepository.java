package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.BrandJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface BrandJpaRepository extends JpaRepository<BrandJpaEntity, String>, JpaSpecificationExecutor<BrandJpaEntity> {
    List<BrandJpaEntity> findByActiveTrueOrderByDisplayOrderAscIdAsc();
}
