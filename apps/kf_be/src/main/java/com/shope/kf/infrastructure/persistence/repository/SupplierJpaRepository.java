package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.SupplierJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface SupplierJpaRepository extends JpaRepository<SupplierJpaEntity, String>, JpaSpecificationExecutor<SupplierJpaEntity> {
}
