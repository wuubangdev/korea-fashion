package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.ShipmentEventJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ShipmentEventJpaRepository extends JpaRepository<ShipmentEventJpaEntity, Long>, JpaSpecificationExecutor<ShipmentEventJpaEntity> {
    List<ShipmentEventJpaEntity> findByShipmentIdOrderByEventTimeDescIdDesc(String shipmentId);
    List<ShipmentEventJpaEntity> findByTrackingNumberOrderByEventTimeDescIdDesc(String trackingNumber);
}
