package com.shope.kf.infrastructure.api.dto.response;

import java.time.Instant;
import java.util.List;

public record ChatbotStoredMessageResponse(
        Long id,
        String role,
        String content,
        List<ChatbotMessageResponse.ProductSuggestion> suggestions,
        Instant createdAt
) {
}
