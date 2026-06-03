package com.shope.kf.infrastructure.api.dto.response;

public record SearchKeywordResponse(
        String keyword,
        Long searchCount
) {
}
