package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.ReviewJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ReviewJpaRepository extends JpaRepository<ReviewJpaEntity, String>, JpaSpecificationExecutor<ReviewJpaEntity> {
}
