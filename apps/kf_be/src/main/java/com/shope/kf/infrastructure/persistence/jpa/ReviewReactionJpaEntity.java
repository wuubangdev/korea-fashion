package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(
        name = "review_reactions",
        indexes = {
                @Index(name = "idx_review_reactions_review", columnList = "review_id"),
                @Index(name = "idx_review_reactions_user", columnList = "user_id")
        },
        uniqueConstraints = @UniqueConstraint(name = "uk_review_reactions_review_user", columnNames = {"review_id", "user_id"})
)
@Data
@EqualsAndHashCode(callSuper = false)
public class ReviewReactionJpaEntity extends BaseJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "review_id", nullable = false, length = 10)
    private String reviewId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, length = 20)
    private String reaction;
}
