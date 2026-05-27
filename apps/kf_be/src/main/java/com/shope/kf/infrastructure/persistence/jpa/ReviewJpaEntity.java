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
        name = "reviews",
        indexes = {
                @Index(name = "idx_reviews_product", columnList = "product_id,status"),
                @Index(name = "idx_reviews_user", columnList = "user_id")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class ReviewJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 10)
    private String id;

    private Long productId;
    private Long userId;
    private Long orderId;
    private Long orderItemId;
    private Integer rating;

    @Column(length = 180)
    private String title;

    @Column(length = 500)
    private String content;

    @Column(length = 40)
    private String status;

    @Column(length = 120)
    private String reviewerName;

    @Column(length = 500)
    private String reviewerAvatarUrl;

    private Boolean verifiedPurchase;
    private Integer helpfulCount;
    private Integer reportCount;

    @Column(length = 1000)
    private String adminReply;

    private OffsetDateTime adminRepliedAt;
    private OffsetDateTime reviewedAt;
}
