package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.PurchaseReceiptJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PurchaseReceiptJpaRepository extends JpaRepository<PurchaseReceiptJpaEntity, String>, JpaSpecificationExecutor<PurchaseReceiptJpaEntity> {
}
