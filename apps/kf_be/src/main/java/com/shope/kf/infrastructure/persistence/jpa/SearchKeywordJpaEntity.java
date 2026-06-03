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

import java.time.Instant;

@Entity
@Table(
        name = "search_keywords",
        indexes = {
                @Index(name = "idx_search_keywords_normalized", columnList = "normalized_keyword", unique = true),
                @Index(name = "idx_search_keywords_count", columnList = "search_count")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class SearchKeywordJpaEntity extends BaseJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String keyword;

    @Column(name = "normalized_keyword", nullable = false, unique = true, length = 120)
    private String normalizedKeyword;

    @Column(name = "search_count", nullable = false)
    private Long searchCount = 0L;

    @Column(name = "last_searched_at")
    private Instant lastSearchedAt;
}
