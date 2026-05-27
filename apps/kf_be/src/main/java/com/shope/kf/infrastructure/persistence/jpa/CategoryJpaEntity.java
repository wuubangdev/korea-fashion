package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(
        name = "categories",
        indexes = {
                @Index(name = "idx_categories_slug", columnList = "slug"),
                @Index(name = "idx_categories_active_order", columnList = "active,display_order")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class CategoryJpaEntity extends BaseJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String code;

    private String name;

    @Column(length = 1000)
    private String description;

    @Column(length = 120, unique = true)
    private String slug;

    @Column(length = 500)
    private String imageUrl;

    @Column(length = 500)
    private String bannerImageUrl;

    private Long parentId;
    @Column(name = "display_order")
    private Integer displayOrder;
    private Boolean active;

    @Column(length = 160)
    private String seoTitle;

    @Column(length = 500)
    private String seoDescription;
}
