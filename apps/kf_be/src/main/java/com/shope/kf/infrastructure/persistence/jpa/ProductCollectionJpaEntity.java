package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.OffsetDateTime;

@Entity
@Table(
        name = "product_collections",
        indexes = {
                @Index(name = "idx_product_collections_slug", columnList = "slug"),
                @Index(name = "idx_product_collections_active_order", columnList = "active,display_order")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class ProductCollectionJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 30)
    private String id;

    @Column(length = 120, nullable = false)
    private String name;

    @Column(length = 120, unique = true)
    private String slug;

    @Column(length = 1000)
    private String description;

    @Column(length = 500)
    private String imageUrl;

    @Column(length = 500)
    private String bannerImageUrl;

    @Column(name = "display_order")
    private Integer displayOrder;

    private Boolean active;
    private OffsetDateTime startsAt;
    private OffsetDateTime endsAt;

    @Column(length = 160)
    private String seoTitle;

    @Column(length = 500)
    private String seoDescription;
}
