package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.ReturnRequestJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ReturnRequestJpaRepository extends JpaRepository<ReturnRequestJpaEntity, String>, JpaSpecificationExecutor<ReturnRequestJpaEntity> {
    List<ReturnRequestJpaEntity> findByOrderIdOrderByRequestedAtDesc(String orderId);
}
