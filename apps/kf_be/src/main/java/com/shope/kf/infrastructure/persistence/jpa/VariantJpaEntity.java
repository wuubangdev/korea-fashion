package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "variants")
@Data
public class VariantJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;

    @Column(unique = true)
    private String sku;

    private Integer quantity;

    private BigDecimal price;

    private String size;

    private String color;
}
