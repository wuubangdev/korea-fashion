package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "variants")
@Data
public class VariantJpaEntity extends BaseJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;

    @Column(unique = true)
    private String sku;

    @Column(length = 80)
    private String barcode;

    private Integer quantity;
    private Integer reservedQuantity;
    private Integer availableQuantity;
    private Integer lowStockThreshold;

    private BigDecimal price;
    private BigDecimal compareAtPrice;
    private BigDecimal costPrice;

    @Column(length = 30)
    private String sizeId;

    private String size;

    @Column(length = 30)
    private String colorId;

    private String color;

    @Column(length = 20)
    private String colorHex;

    private BigDecimal weight;

    @Column(length = 500)
    private String imageUrl;

    private Boolean active;
}
