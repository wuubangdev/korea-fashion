package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.PaymentTransactionJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface PaymentTransactionJpaRepository extends JpaRepository<PaymentTransactionJpaEntity, String>, JpaSpecificationExecutor<PaymentTransactionJpaEntity> {
    List<PaymentTransactionJpaEntity> findByOrderIdOrderByInitiatedAtDesc(String orderId);
}
