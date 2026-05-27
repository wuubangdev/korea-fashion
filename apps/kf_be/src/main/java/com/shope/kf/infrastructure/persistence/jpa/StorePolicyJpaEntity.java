package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(
        name = "store_policies",
        indexes = {
                @Index(name = "idx_store_policies_slug", columnList = "slug"),
                @Index(name = "idx_store_policies_active_order", columnList = "active,display_order")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class StorePolicyJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 30)
    private String id;

    @Column(length = 120, nullable = false)
    private String title;

    @Column(length = 120, unique = true)
    private String slug;

    @Column(length = 500)
    private String summary;

    @Lob
    private String content;

    @Column(length = 40)
    private String type;

    @Column(name = "display_order")
    private Integer displayOrder;

    private Boolean active;
}
