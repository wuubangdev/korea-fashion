package com.shope.kf.infrastructure.search;

import com.shope.kf.infrastructure.api.dto.response.SearchKeywordResponse;
import com.shope.kf.infrastructure.exception.AppException;
import com.shope.kf.infrastructure.exception.ErrorCode;
import com.shope.kf.infrastructure.persistence.jpa.SearchKeywordJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.SearchKeywordJpaRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.text.Normalizer;
import java.time.Instant;
import java.util.List;
import java.util.Locale;

@Service
public class SearchKeywordService {
    private static final int MAX_KEYWORD_LENGTH = 120;

    private final SearchKeywordJpaRepository repository;

    public SearchKeywordService(SearchKeywordJpaRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public SearchKeywordResponse record(String rawKeyword) {
        String keyword = cleanKeyword(rawKeyword);
        String normalized = normalize(keyword);
        if (!StringUtils.hasText(normalized)) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Search keyword is invalid");
        }
        SearchKeywordJpaEntity entity = repository.findByNormalizedKeyword(normalized)
                .orElseGet(() -> {
                    SearchKeywordJpaEntity next = new SearchKeywordJpaEntity();
                    next.setKeyword(keyword);
                    next.setNormalizedKeyword(normalized);
                    next.setSearchCount(0L);
                    return next;
                });
        entity.setKeyword(keyword);
        entity.setSearchCount((entity.getSearchCount() == null ? 0L : entity.getSearchCount()) + 1);
        entity.setLastSearchedAt(Instant.now());
        return toResponse(repository.save(entity));
    }

    @Transactional(readOnly = true)
    public List<SearchKeywordResponse> popular(int size) {
        int safeSize = Math.max(1, Math.min(size, 20));
        return repository.findByDeletedAtIsNullOrderBySearchCountDescLastSearchedAtDesc(PageRequest.of(0, safeSize)).stream()
                .map(this::toResponse)
                .toList();
    }

    private SearchKeywordResponse toResponse(SearchKeywordJpaEntity entity) {
        return new SearchKeywordResponse(entity.getKeyword(), entity.getSearchCount());
    }

    private String cleanKeyword(String rawKeyword) {
        String keyword = StringUtils.hasText(rawKeyword) ? rawKeyword.replaceAll("\\s+", " ").trim() : "";
        if (keyword.length() > MAX_KEYWORD_LENGTH) {
            keyword = keyword.substring(0, MAX_KEYWORD_LENGTH).trim();
        }
        return keyword;
    }

    private String normalize(String value) {
        return Normalizer.normalize(value.toLowerCase(Locale.ROOT), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replace('\u0111', 'd')
                .replaceAll("[^\\p{L}\\p{N}]+", " ")
                .trim();
    }
}
