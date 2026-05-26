package com.shope.kf.infrastructure.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class OrderResponse {
    private Long id;
    private OffsetDateTime orderDate;
    private BigDecimal total;
    private String status;
    private String shipperId;
    private String shippingStatus;
    private String deliveryAddress;
    private OffsetDateTime assignedAt;
    private OffsetDateTime shippedAt;
    private OffsetDateTime deliveredAt;
    private String note;
    private List<OrderItemResponse> items;

    @Data
    @AllArgsConstructor
    @Builder
    public static class OrderItemResponse {
        private Long id;
        private Long productId;
        private Long variantId;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal total;
    }
}
