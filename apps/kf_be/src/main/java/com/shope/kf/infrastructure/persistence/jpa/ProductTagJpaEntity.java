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
        name = "product_tags",
        indexes = {
                @Index(name = "idx_product_tags_slug", columnList = "slug"),
                @Index(name = "idx_product_tags_active_order", columnList = "active,display_order")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class ProductTagJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 40)
    private String id;

    @Column(length = 100, nullable = false)
    private String name;

    @Column(length = 120, unique = true)
    private String slug;

    @Column(length = 500)
    private String description;

    @Column(name = "display_order")
    private Integer displayOrder;

    private Boolean active;
}
