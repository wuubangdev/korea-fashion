package com.shope.kf.infrastructure.api.dto.response;

import java.time.Instant;

public record ChatbotSessionResponse(
        Long id,
        String title,
        Instant createdAt,
        Instant updatedAt
) {
}
