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
public class OrderItem {
    private Long id;
    private Long productId;
    private Long variantId;
    private String productName;
    private String productImageUrl;
    private String sku;
    private String size;
    private String color;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal unitPrice;
    private BigDecimal discount;
    private BigDecimal total;
}
