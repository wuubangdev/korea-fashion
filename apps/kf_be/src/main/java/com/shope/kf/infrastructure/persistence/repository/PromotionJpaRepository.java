package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.PromotionJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PromotionJpaRepository extends JpaRepository<PromotionJpaEntity, String>, JpaSpecificationExecutor<PromotionJpaEntity> {
}
