package com.shope.kf.infrastructure.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ReviewReactionRequest(
        @NotBlank
        @Pattern(regexp = "LIKE|DISLIKE", flags = Pattern.Flag.CASE_INSENSITIVE)
        String reaction
) {
}
