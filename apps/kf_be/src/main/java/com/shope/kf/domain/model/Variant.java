package com.shope.kf.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Variant {
    private Long id;
    private Long productId;
    private String sku;
    private Integer quantity;
    private BigDecimal price;
    private String size;
    private String color;
}
