package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.OffsetDateTime;
import java.util.List;

@Entity
@Table(
        name = "reviews",
        indexes = {
                @Index(name = "idx_reviews_product", columnList = "product_id,status"),
                @Index(name = "idx_reviews_user", columnList = "user_id"),
                @Index(name = "idx_reviews_parent", columnList = "parent_review_id")
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
    @Column(name = "parent_review_id", length = 10)
    private String parentReviewId;
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
    private Integer dislikeCount;
    private Integer reportCount;

    @Column(length = 1000)
    private String adminReply;

    private OffsetDateTime adminRepliedAt;
    private OffsetDateTime reviewedAt;

    @Transient
    private List<ReviewImageJpaEntity> images;

    @Transient
    private String currentUserReaction;
}
