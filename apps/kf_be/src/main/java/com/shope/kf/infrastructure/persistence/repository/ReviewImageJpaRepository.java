package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.ReviewImageJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ReviewImageJpaRepository extends JpaRepository<ReviewImageJpaEntity, Long>, JpaSpecificationExecutor<ReviewImageJpaEntity> {
    List<ReviewImageJpaEntity> findByReviewIdAndActiveTrueOrderByDisplayOrderAscIdAsc(String reviewId);
}
