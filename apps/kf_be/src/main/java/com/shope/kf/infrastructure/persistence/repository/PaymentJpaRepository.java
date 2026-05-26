package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.PaymentJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PaymentJpaRepository extends JpaRepository<PaymentJpaEntity, String>, JpaSpecificationExecutor<PaymentJpaEntity> {
}
