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

@Entity
@Table(
        name = "product_options",
        indexes = {
                @Index(name = "idx_product_options_product", columnList = "product_id"),
                @Index(name = "idx_product_options_code", columnList = "code")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class ProductOptionJpaEntity extends BaseJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id")
    private Long productId;

    @Column(length = 50, nullable = false)
    private String code;

    @Column(length = 100, nullable = false)
    private String name;

    @Column(length = 30)
    private String type;

    @Column(name = "display_order")
    private Integer displayOrder;

    private Boolean required;
    private Boolean filterable;
    private Boolean active;
}
