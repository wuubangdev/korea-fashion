package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "purchase_receipts")
@Data
@EqualsAndHashCode(callSuper = false)
public class PurchaseReceiptJpaEntity extends BaseJpaEntity {
    @Id
    private String id;
    private OffsetDateTime importedAt;
    private BigDecimal total;
    private String supplierId;
}
