package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "shipment_events",
        indexes = {
                @Index(name = "idx_shipment_events_shipment", columnList = "shipment_id,event_time"),
                @Index(name = "idx_shipment_events_tracking", columnList = "tracking_number")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class ShipmentEventJpaEntity extends BaseJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "shipment_id", length = 60, nullable = false)
    private String shipmentId;

    @Column(length = 120)
    private String trackingNumber;

    @Column(length = 40)
    private String status;

    @Column(length = 160)
    private String location;

    @Column(length = 500)
    private String message;

    @Column(name = "event_time")
    private LocalDateTime eventTime;

    @Column(length = 120)
    private String source;
}
