package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.PaymentJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PaymentJpaRepository extends JpaRepository<PaymentJpaEntity, String>, JpaSpecificationExecutor<PaymentJpaEntity> {
    @Query("""
            select p
            from PaymentJpaEntity p
            where p.orderId in (
                select o.id from OrderJpaEntity o where o.customerId = :userId
            )
            """)
    Page<PaymentJpaEntity> findByCustomerId(@Param("userId") Long userId, Pageable pageable);
}
