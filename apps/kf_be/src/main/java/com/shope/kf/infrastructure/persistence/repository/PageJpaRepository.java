package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.PageJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface PageJpaRepository extends JpaRepository<PageJpaEntity, String>, JpaSpecificationExecutor<PageJpaEntity> {
    Optional<PageJpaEntity> findBySlugAndStatusIgnoreCase(String slug, String status);
    List<PageJpaEntity> findByStatusIgnoreCaseOrderByPublishedAtDesc(String status);
}
