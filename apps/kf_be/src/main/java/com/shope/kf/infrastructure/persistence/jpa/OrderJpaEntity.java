package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
public class OrderJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItemJpaEntity> items = new ArrayList<>();
}
