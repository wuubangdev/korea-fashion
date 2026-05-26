package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.OrderJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderJpaRepository extends JpaRepository<OrderJpaEntity, Long> {
    Page<OrderJpaEntity> findByStatusContainingIgnoreCase(String status, Pageable pageable);
    Page<OrderJpaEntity> findByShipperId(String shipperId, Pageable pageable);
}
