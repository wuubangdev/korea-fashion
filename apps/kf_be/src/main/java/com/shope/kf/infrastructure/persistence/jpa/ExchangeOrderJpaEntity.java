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
        name = "exchange_orders",
        indexes = {
                @Index(name = "idx_exchange_orders_return", columnList = "return_request_id"),
                @Index(name = "idx_exchange_orders_order", columnList = "original_order_id")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class ExchangeOrderJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 50)
    private String id;

    @Column(length = 50, nullable = false)
    private String exchangeCode;

    @Column(name = "return_request_id", length = 50)
    private String returnRequestId;

    @Column(name = "original_order_id", length = 50)
    private String originalOrderId;

    @Column(length = 50)
    private String replacementOrderId;

    private Long oldVariantId;
    private Long newVariantId;
    private Integer quantity;
    private BigDecimal priceDifference;

    @Column(length = 40)
    private String status;

    private LocalDateTime requestedAt;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime cancelledAt;

    @Column(length = 500)
    private String note;
}
