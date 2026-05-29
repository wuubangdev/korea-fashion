package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.WishlistItemJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistItemJpaRepository extends JpaRepository<WishlistItemJpaEntity, Long> {
    boolean existsByUserIdAndProductId(Long userId, Long productId);

    List<WishlistItemJpaEntity> findByUserIdOrderByAddedAtDesc(Long userId);

    Optional<WishlistItemJpaEntity> findByUserIdAndProductId(Long userId, Long productId);
}
