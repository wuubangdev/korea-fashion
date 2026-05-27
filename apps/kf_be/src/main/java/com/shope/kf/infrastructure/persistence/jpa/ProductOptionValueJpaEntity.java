package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(
        name = "product_option_values",
        indexes = {
                @Index(name = "idx_option_values_product", columnList = "product_id"),
                @Index(name = "idx_option_values_option", columnList = "option_id"),
                @Index(name = "idx_option_values_code", columnList = "code")
        }
)
@Data
public class ProductOptionValueJpaEntity extends BaseJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "option_id")
    private Long optionId;

    @Column(length = 50, nullable = false)
    private String code;

    @Column(length = 100, nullable = false)
    private String value;

    @Column(length = 20)
    private String colorHex;

    @Column(length = 500)
    private String imageUrl;

    @Column(name = "display_order")
    private Integer displayOrder;

    private Boolean active;
}
