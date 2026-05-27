package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "banners",
        indexes = {
                @Index(name = "idx_banners_active_order", columnList = "active,display_order"),
                @Index(name = "idx_banners_placement", columnList = "placement")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class BannerJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 30)
    private String id;

    @Column(length = 120, nullable = false)
    private String title;

    @Column(length = 300)
    private String subtitle;

    @Column(length = 1000)
    private String description;

    @Column(length = 500, nullable = false)
    private String imageUrl;

    @Column(length = 500)
    private String mobileImageUrl;

    @Column(length = 120)
    private String ctaLabel;

    @Column(length = 500)
    private String ctaUrl;

    @Column(length = 50)
    private String placement;

    @Column(name = "display_order")
    private Integer displayOrder;
    private Boolean active;
    private LocalDateTime startsAt;
    private LocalDateTime endsAt;
}
