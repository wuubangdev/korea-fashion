package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.OffsetDateTime;

@Entity
@Table(name = "reviews")
@Data
public class ReviewJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 10)
    private String id;

    private Long productId;
    private Long userId;
    private Integer rating;

    @Column(length = 500)
    private String content;

    private OffsetDateTime reviewedAt;
}
