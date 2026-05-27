package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.ShipmentJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface ShipmentJpaRepository extends JpaRepository<ShipmentJpaEntity, String>, JpaSpecificationExecutor<ShipmentJpaEntity> {
    List<ShipmentJpaEntity> findByOrderIdOrderByLabelCreatedAtDesc(String orderId);
    Optional<ShipmentJpaEntity> findByTrackingNumber(String trackingNumber);
}
