package com.shope.kf.infrastructure.persistence.jpa;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
@EqualsAndHashCode(callSuper = false)
public class OrderItemJpaEntity extends BaseJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
    private Long variantId;
    private String productName;
    private String productImageUrl;
    private String sku;
    private String size;
    private String color;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal unitPrice;
    private BigDecimal discount;
    private BigDecimal total;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private OrderJpaEntity order;
}
