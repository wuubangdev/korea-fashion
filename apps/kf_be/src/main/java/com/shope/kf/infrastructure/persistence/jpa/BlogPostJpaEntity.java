package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "blog_posts",
        indexes = {
                @Index(name = "idx_blog_posts_slug", columnList = "slug", unique = true),
                @Index(name = "idx_blog_posts_status", columnList = "status,published_at")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class BlogPostJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 50)
    private String id;

    @Column(length = 180, nullable = false)
    private String title;

    @Column(length = 200, nullable = false)
    private String slug;

    @Column(length = 500)
    private String excerpt;

    @Lob
    private String content;

    @Column(length = 120)
    private String authorName;

    @Column(length = 120)
    private String category;

    @Column(length = 500)
    private String thumbnailUrl;

    @Column(length = 1000)
    private String tags;

    @Column(length = 30)
    private String status;

    @Column(length = 180)
    private String seoTitle;

    @Column(length = 500)
    private String seoDescription;

    private LocalDateTime publishedAt;
}
