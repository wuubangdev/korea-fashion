package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.CouponJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface CouponJpaRepository extends JpaRepository<CouponJpaEntity, String>, JpaSpecificationExecutor<CouponJpaEntity> {
    Optional<CouponJpaEntity> findByCodeIgnoreCaseAndActiveTrue(String code);
}
