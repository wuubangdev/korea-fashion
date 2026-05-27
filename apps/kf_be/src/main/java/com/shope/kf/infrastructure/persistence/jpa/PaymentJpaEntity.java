package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "payments")
@Data
public class PaymentJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 10)
    private String id;

    private Long orderId;
    private BigDecimal amount;
    private OffsetDateTime paidAt;

    @Column(length = 30)
    private String method;

    @Column(length = 20)
    private String status;
}
