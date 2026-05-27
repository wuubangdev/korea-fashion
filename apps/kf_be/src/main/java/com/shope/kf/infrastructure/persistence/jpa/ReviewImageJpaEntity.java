package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(
        name = "review_images",
        indexes = @Index(name = "idx_review_images_review", columnList = "review_id")
)
@Data
@EqualsAndHashCode(callSuper = false)
public class ReviewImageJpaEntity extends BaseJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "review_id", length = 10, nullable = false)
    private String reviewId;

    @Column(length = 500, nullable = false)
    private String imageUrl;

    @Column(length = 200)
    private String altText;

    private Integer displayOrder;
    private Boolean active;
}
