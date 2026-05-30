package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.ReviewJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ReviewJpaRepository extends JpaRepository<ReviewJpaEntity, String>, JpaSpecificationExecutor<ReviewJpaEntity> {
    Page<ReviewJpaEntity> findByProductIdAndStatusIgnoreCase(Long productId, String status, Pageable pageable);

    Page<ReviewJpaEntity> findByUserId(Long userId, Pageable pageable);

    Page<ReviewJpaEntity> findByProductIdAndStatusIgnoreCaseAndParentReviewIdIsNull(Long productId, String status, Pageable pageable);
}
