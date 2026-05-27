package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.CouponRedemptionJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface CouponRedemptionJpaRepository extends JpaRepository<CouponRedemptionJpaEntity, String>, JpaSpecificationExecutor<CouponRedemptionJpaEntity> {
    List<CouponRedemptionJpaEntity> findByCouponIdOrderByRedeemedAtDesc(String couponId);
    List<CouponRedemptionJpaEntity> findByOrderIdOrderByRedeemedAtDesc(String orderId);
}
