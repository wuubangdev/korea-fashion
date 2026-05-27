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
        name = "return_requests",
        indexes = {
                @Index(name = "idx_return_requests_order", columnList = "order_id"),
                @Index(name = "idx_return_requests_status", columnList = "status")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class ReturnRequestJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 50)
    private String id;

    @Column(length = 50, nullable = false)
    @NotBlank
    private String returnCode;

    @Column(name = "order_id", length = 50, nullable = false)
    @NotBlank
    private String orderId;

    private Long customerId;

    @Column(length = 120)
    private String customerName;

    @Column(length = 30)
    private String customerPhone;

    @Column(length = 160)
    private String customerEmail;

    @Column(length = 30)
    private String type;

    @Column(length = 30)
    private String status;

    @Column(length = 300)
    private String reason;

    @Column(length = 1000)
    private String customerNote;

    @Column(length = 1000)
    private String adminNote;

    private BigDecimal requestedAmount;
    private BigDecimal approvedAmount;
    private LocalDateTime requestedAt;
    private LocalDateTime approvedAt;
    private LocalDateTime rejectedAt;
    private LocalDateTime receivedAt;
    private LocalDateTime completedAt;

    @Column(length = 120)
    private String processedBy;
}
