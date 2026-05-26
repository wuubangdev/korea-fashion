package com.shope.kf.infrastructure.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateShippingStatusRequest {
    @NotBlank
    private String shippingStatus;
}
