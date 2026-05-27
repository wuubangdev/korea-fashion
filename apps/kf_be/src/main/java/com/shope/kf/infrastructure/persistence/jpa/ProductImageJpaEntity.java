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
        name = "product_images",
        indexes = {
                @Index(name = "idx_product_images_product", columnList = "product_id"),
                @Index(name = "idx_product_images_active_order", columnList = "active,display_order")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class ProductImageJpaEntity extends BaseJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id")
    private Long productId;

    @Column(length = 500, nullable = false)
    private String imageUrl;

    @Column(length = 200)
    private String altText;

    @Column(name = "display_order")
    private Integer displayOrder;
    private Boolean primaryImage;
    private Boolean active;
}
