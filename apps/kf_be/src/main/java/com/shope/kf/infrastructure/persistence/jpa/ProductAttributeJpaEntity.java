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
        name = "product_attributes",
        indexes = {
                @Index(name = "idx_product_attributes_product", columnList = "product_id"),
                @Index(name = "idx_product_attributes_key", columnList = "attribute_key")
        }
)
@Data
public class ProductAttributeJpaEntity extends BaseJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "attribute_key", length = 80, nullable = false)
    private String attributeKey;

    @Column(name = "attribute_value", length = 500)
    private String attributeValue;

    @Column(length = 80)
    private String groupName;

    @Column(name = "display_order")
    private Integer displayOrder;

    private Boolean filterable;
    private Boolean visible;
}
