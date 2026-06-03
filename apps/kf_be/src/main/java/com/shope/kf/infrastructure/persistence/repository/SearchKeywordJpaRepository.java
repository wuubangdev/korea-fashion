package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.SearchKeywordJpaEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SearchKeywordJpaRepository extends JpaRepository<SearchKeywordJpaEntity, Long> {
    Optional<SearchKeywordJpaEntity> findByNormalizedKeyword(String normalizedKeyword);
    List<SearchKeywordJpaEntity> findByDeletedAtIsNullOrderBySearchCountDescLastSearchedAtDesc(Pageable pageable);
}
