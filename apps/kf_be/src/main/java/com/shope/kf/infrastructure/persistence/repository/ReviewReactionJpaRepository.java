package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.ReviewReactionJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ReviewReactionJpaRepository extends JpaRepository<ReviewReactionJpaEntity, Long> {
    long countByReviewIdAndReaction(String reviewId, String reaction);
    void deleteByReviewIdIn(Collection<String> reviewIds);
    List<ReviewReactionJpaEntity> findByReviewIdInAndUserId(Collection<String> reviewIds, Long userId);
    Optional<ReviewReactionJpaEntity> findByReviewIdAndUserId(String reviewId, Long userId);
}
