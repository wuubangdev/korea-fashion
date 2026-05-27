package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "refunds",
        indexes = {
                @Index(name = "idx_refunds_order", columnList = "order_id"),
                @Index(name = "idx_refunds_return", columnList = "return_request_id"),
                @Index(name = "idx_refunds_status", columnList = "status")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class RefundJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 50)
    private String id;

    @Column(length = 50, nullable = false)
    private String refundCode;

    @Column(name = "order_id", length = 50)
    private String orderId;

    @Column(name = "return_request_id", length = 50)
    private String returnRequestId;

    private BigDecimal amount;

    @Column(length = 40)
    private String method;

    @Column(length = 40)
    private String status;

    @Column(length = 120)
    private String provider;

    @Column(length = 160)
    private String providerRefundId;

    @Column(length = 500)
    private String reason;

    private LocalDateTime requestedAt;
    private LocalDateTime processedAt;
    private LocalDateTime failedAt;

    @Column(length = 500)
    private String failureReason;
}
