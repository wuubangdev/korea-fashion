package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.SizeJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface SizeJpaRepository extends JpaRepository<SizeJpaEntity, String>, JpaSpecificationExecutor<SizeJpaEntity> {
}
