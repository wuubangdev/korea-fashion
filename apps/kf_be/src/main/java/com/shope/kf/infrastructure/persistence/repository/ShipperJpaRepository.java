package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.ShipperJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ShipperJpaRepository extends JpaRepository<ShipperJpaEntity, String>, JpaSpecificationExecutor<ShipperJpaEntity> {
}
