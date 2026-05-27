package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "pages",
        indexes = {
                @Index(name = "idx_pages_slug", columnList = "slug", unique = true),
                @Index(name = "idx_pages_status", columnList = "status")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class PageJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 50)
    private String id;

    @Column(length = 160, nullable = false)
    @NotBlank
    private String title;

    @Column(length = 180, nullable = false)
    @NotBlank
    private String slug;

    @Column(length = 500)
    private String excerpt;

    @Lob
    private String content;

    @Column(length = 40)
    private String pageType;

    @Column(length = 30)
    private String status;

    @Column(length = 180)
    private String seoTitle;

    @Column(length = 500)
    private String seoDescription;

    @Column(length = 500)
    private String seoThumbnailUrl;

    private LocalDateTime publishedAt;
}
