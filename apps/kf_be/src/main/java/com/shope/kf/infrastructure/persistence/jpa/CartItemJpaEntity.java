package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "cart_items")
@Data
@EqualsAndHashCode(callSuper = false)
public class CartItemJpaEntity extends BaseJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String cartId;
    private Long productId;
    private Long variantId;
    private Integer quantity;
}
