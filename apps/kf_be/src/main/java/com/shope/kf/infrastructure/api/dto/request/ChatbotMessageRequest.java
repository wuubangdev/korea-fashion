package com.shope.kf.infrastructure.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ChatbotMessageRequest(
        @NotBlank
        @Size(max = 1000)
        String message,
        Long sessionId,
        @Size(max = 80)
        String clientSessionId,
        List<ChatHistoryItem> history
) {
    public record ChatHistoryItem(
            @Size(max = 20)
            String role,
            @Size(max = 1000)
            String content
    ) {
    }
}
