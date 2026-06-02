package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.ReviewJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewJpaRepository extends JpaRepository<ReviewJpaEntity, String>, JpaSpecificationExecutor<ReviewJpaEntity> {
    Page<ReviewJpaEntity> findByProductIdAndStatusIgnoreCase(Long productId, String status, Pageable pageable);

    Page<ReviewJpaEntity> findByUserId(Long userId, Pageable pageable);

    Page<ReviewJpaEntity> findByProductIdAndStatusIgnoreCaseAndParentReviewIdIsNull(Long productId, String status, Pageable pageable);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update ReviewJpaEntity r set r.reviewerAvatarUrl = :avatarUrl where r.userId = :userId")
    int updateReviewerAvatarByUserId(@Param("userId") Long userId, @Param("avatarUrl") String avatarUrl);
}
