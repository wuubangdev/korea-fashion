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
        name = "product_relations",
        indexes = {
                @Index(name = "idx_product_relations_product", columnList = "product_id,relation_type"),
                @Index(name = "idx_product_relations_related", columnList = "related_product_id")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class ProductRelationJpaEntity extends BaseJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "related_product_id", nullable = false)
    private Long relatedProductId;

    @Column(length = 40, nullable = false)
    private String relationType;

    private Integer displayOrder;
    private Boolean active;
}
