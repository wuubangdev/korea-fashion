package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "payment_transactions",
        indexes = {
                @Index(name = "idx_payment_transactions_order", columnList = "order_id"),
                @Index(name = "idx_payment_transactions_status", columnList = "status"),
                @Index(name = "idx_payment_transactions_provider", columnList = "provider,provider_transaction_id")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class PaymentTransactionJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 60)
    private String id;

    @Column(name = "order_id", length = 50, nullable = false)
    @NotBlank
    private String orderId;

    @Column(length = 40)
    private String paymentMethodId;

    @Column(length = 80)
    private String provider;

    @Column(length = 160)
    private String providerTransactionId;

    @Column(length = 40)
    private String type;

    @Column(length = 40)
    private String status;

    private BigDecimal amount;

    @Column(length = 10)
    private String currency;

    @Column(length = 500)
    private String redirectUrl;

    @Column(length = 500)
    private String callbackUrl;

    @Lob
    private String rawRequest;

    @Lob
    private String rawResponse;

    private LocalDateTime initiatedAt;
    private LocalDateTime paidAt;
    private LocalDateTime failedAt;
    private LocalDateTime expiredAt;

    @Column(length = 500)
    private String failureReason;
}
