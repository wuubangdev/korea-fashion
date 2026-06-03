package com.shope.kf.infrastructure.api.dto.response;

import java.util.List;

public record ChatbotMessageResponse(
        Long sessionId,
        String answer,
        List<ProductSuggestion> suggestions,
        int remainingDailyMessages
) {
    public record ProductSuggestion(
            Long id,
            String name,
            String brand,
            String category,
            String price,
            String url
    ) {
    }
}
