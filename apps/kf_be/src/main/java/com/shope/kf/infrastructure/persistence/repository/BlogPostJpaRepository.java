package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.BlogPostJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface BlogPostJpaRepository extends JpaRepository<BlogPostJpaEntity, String>, JpaSpecificationExecutor<BlogPostJpaEntity> {
    Optional<BlogPostJpaEntity> findBySlugAndStatusIgnoreCase(String slug, String status);
    List<BlogPostJpaEntity> findByStatusIgnoreCaseOrderByPublishedAtDesc(String status);
}
