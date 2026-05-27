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

import java.math.BigDecimal;

@Entity
@Table(
        name = "return_items",
        indexes = {
                @Index(name = "idx_return_items_request", columnList = "return_request_id"),
                @Index(name = "idx_return_items_product", columnList = "product_id")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class ReturnItemJpaEntity extends BaseJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "return_request_id", length = 50, nullable = false)
    private String returnRequestId;

    private Long orderItemId;
    private Long productId;
    private Long variantId;

    @Column(length = 180)
    private String productName;

    @Column(length = 80)
    private String sku;

    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal refundAmount;

    @Column(length = 40)
    private String conditionStatus;

    @Column(length = 300)
    private String reason;
}
