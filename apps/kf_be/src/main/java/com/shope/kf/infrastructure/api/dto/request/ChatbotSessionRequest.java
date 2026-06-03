package com.shope.kf.infrastructure.api.dto.request;

import jakarta.validation.constraints.Size;

public record ChatbotSessionRequest(
        @Size(max = 80)
        String clientSessionId
) {
}
