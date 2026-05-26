package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.ColorJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ColorJpaRepository extends JpaRepository<ColorJpaEntity, String>, JpaSpecificationExecutor<ColorJpaEntity> {
}
