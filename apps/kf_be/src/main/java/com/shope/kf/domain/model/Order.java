package com.shope.kf.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
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
    private List<OrderItem> items;
}
