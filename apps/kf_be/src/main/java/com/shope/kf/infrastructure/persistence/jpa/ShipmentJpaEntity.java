package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "shipments",
        indexes = {
                @Index(name = "idx_shipments_order", columnList = "order_id"),
                @Index(name = "idx_shipments_tracking", columnList = "tracking_number"),
                @Index(name = "idx_shipments_status", columnList = "status")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class ShipmentJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 60)
    private String id;

    @Column(name = "order_id", length = 50, nullable = false)
    @NotBlank
    private String orderId;

    @Column(length = 50)
    private String shipmentCode;

    @Column(length = 40)
    private String shippingMethodId;

    @Column(length = 120)
    private String carrierName;

    @Column(length = 80)
    private String carrierServiceCode;

    @Column(length = 120)
    private String trackingNumber;

    @Column(length = 500)
    private String trackingUrl;

    @Column(length = 40)
    private String status;

    private BigDecimal shippingFee;
    private BigDecimal codAmount;
    private BigDecimal weight;

    @Column(length = 500)
    private String recipientAddress;

    @Column(length = 120)
    private String recipientName;

    @Column(length = 30)
    private String recipientPhone;

    private LocalDateTime labelCreatedAt;
    private LocalDateTime pickedUpAt;
    private LocalDateTime estimatedDeliveryAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime failedAt;
    private LocalDateTime returnedAt;

    @Column(length = 500)
    private String note;
}
