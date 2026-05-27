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
    private String barcode;
    private Integer quantity;
    private Integer reservedQuantity;
    private Integer availableQuantity;
    private Integer lowStockThreshold;
    private BigDecimal price;
    private BigDecimal compareAtPrice;
    private BigDecimal costPrice;
    private String sizeId;
    private String size;
    private String colorId;
    private String color;
    private String colorHex;
    private BigDecimal weight;
    private String imageUrl;
    private Boolean active;
}
