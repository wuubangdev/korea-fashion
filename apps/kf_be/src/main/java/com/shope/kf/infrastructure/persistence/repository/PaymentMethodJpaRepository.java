package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.PaymentMethodJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface PaymentMethodJpaRepository extends JpaRepository<PaymentMethodJpaEntity, String>, JpaSpecificationExecutor<PaymentMethodJpaEntity> {
    List<PaymentMethodJpaEntity> findByActiveTrueOrderByDisplayOrderAscIdAsc();
}
