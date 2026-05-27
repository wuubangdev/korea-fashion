package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.ShippingMethodJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ShippingMethodJpaRepository extends JpaRepository<ShippingMethodJpaEntity, String>, JpaSpecificationExecutor<ShippingMethodJpaEntity> {
    List<ShippingMethodJpaEntity> findByActiveTrueOrderByDisplayOrderAscIdAsc();
}
