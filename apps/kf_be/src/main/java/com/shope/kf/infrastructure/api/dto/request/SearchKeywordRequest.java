package com.shope.kf.infrastructure.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SearchKeywordRequest(
        @NotBlank
        @Size(max = 120)
        String keyword
) {
}
