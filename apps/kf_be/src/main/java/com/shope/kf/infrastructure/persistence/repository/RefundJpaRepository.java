package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.RefundJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface RefundJpaRepository extends JpaRepository<RefundJpaEntity, String>, JpaSpecificationExecutor<RefundJpaEntity> {
    List<RefundJpaEntity> findByOrderIdOrderByRequestedAtDesc(String orderId);
    List<RefundJpaEntity> findByReturnRequestIdOrderByRequestedAtDesc(String returnRequestId);
}
