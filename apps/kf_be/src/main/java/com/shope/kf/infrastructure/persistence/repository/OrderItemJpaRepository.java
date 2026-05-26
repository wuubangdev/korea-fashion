package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.OrderItemJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface OrderItemJpaRepository extends JpaRepository<OrderItemJpaEntity, Long>, JpaSpecificationExecutor<OrderItemJpaEntity> {
}
