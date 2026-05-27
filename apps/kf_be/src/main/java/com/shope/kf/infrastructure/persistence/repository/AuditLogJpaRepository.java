package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.AuditLogJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AuditLogJpaRepository extends JpaRepository<AuditLogJpaEntity, Long>, JpaSpecificationExecutor<AuditLogJpaEntity> {
}
