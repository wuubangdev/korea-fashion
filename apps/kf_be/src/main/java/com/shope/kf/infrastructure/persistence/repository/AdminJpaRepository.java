package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.AdminJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AdminJpaRepository extends JpaRepository<AdminJpaEntity, String>, JpaSpecificationExecutor<AdminJpaEntity> {
}
