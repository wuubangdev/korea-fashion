package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(
        name = "payment_methods",
        indexes = {
                @Index(name = "idx_payment_methods_active_order", columnList = "active,display_order")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class PaymentMethodJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 30)
    private String id;

    @Column(length = 120, nullable = false)
    private String name;

    @Column(length = 40)
    private String type;

    @Column(length = 500)
    private String description;

    @Column(length = 500)
    private String iconUrl;

    @Column(length = 1000)
    private String instructions;

    @Column(name = "display_order")
    private Integer displayOrder;

    private Boolean active;
}
