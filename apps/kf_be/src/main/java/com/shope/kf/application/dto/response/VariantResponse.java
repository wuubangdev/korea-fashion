package com.shope.kf.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@Builder
public class VariantResponse {
    private Long id;
    private Long productId;
    private String sku;
    private Integer quantity;
    private BigDecimal price;
    private String size;
    private String color;
}
