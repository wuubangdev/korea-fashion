package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.BannerJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface BannerJpaRepository extends JpaRepository<BannerJpaEntity, String>, JpaSpecificationExecutor<BannerJpaEntity> {
    List<BannerJpaEntity> findByActiveTrueOrderByDisplayOrderAsc();
}
