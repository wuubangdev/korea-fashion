package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.ExchangeOrderJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ExchangeOrderJpaRepository extends JpaRepository<ExchangeOrderJpaEntity, String>, JpaSpecificationExecutor<ExchangeOrderJpaEntity> {
    List<ExchangeOrderJpaEntity> findByReturnRequestIdOrderByRequestedAtDesc(String returnRequestId);
}
