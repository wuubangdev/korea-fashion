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
        name = "brands",
        indexes = {
                @Index(name = "idx_brands_slug", columnList = "slug"),
                @Index(name = "idx_brands_active_order", columnList = "active,display_order")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class BrandJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 30)
    private String id;

    @Column(length = 120, nullable = false)
    private String name;

    @Column(length = 120, unique = true)
    private String slug;

    @Column(length = 500)
    private String logoUrl;

    @Column(length = 1000)
    private String description;

    @Column(length = 80)
    private String country;

    @Column(length = 120)
    private String website;

    @Column(name = "display_order")
    private Integer displayOrder;

    private Boolean active;
}
