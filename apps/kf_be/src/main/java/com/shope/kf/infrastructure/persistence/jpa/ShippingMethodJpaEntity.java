package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Entity
@Table(
        name = "shipping_methods",
        indexes = {
                @Index(name = "idx_shipping_methods_active_order", columnList = "active,display_order")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class ShippingMethodJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 30)
    private String id;

    @Column(length = 120, nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    private BigDecimal fee;
    private BigDecimal freeThreshold;

    @Column(length = 80)
    private String carrier;

    @Column(length = 80)
    private String estimatedDelivery;

    @Column(name = "display_order")
    private Integer displayOrder;

    private Boolean active;
}
