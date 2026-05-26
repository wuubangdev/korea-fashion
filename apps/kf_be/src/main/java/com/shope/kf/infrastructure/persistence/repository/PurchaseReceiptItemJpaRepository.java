package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.PurchaseReceiptItemJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PurchaseReceiptItemJpaRepository extends JpaRepository<PurchaseReceiptItemJpaEntity, Long>, JpaSpecificationExecutor<PurchaseReceiptItemJpaEntity> {
}
