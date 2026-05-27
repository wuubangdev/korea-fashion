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
public class OrderJpaEntity extends BaseJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 30, unique = true)
    private String orderCode;

    private Long customerId;
    private String guestCustomerId;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private OffsetDateTime orderDate;
    private BigDecimal subtotal;
    private BigDecimal discountTotal;
    private BigDecimal shippingFee;
    private BigDecimal taxTotal;
    private BigDecimal grandTotal;
    private BigDecimal total;
    private String status;
    private String paymentStatus;
    private String fulfillmentStatus;
    private String shipperId;
    private String shippingStatus;
    private String deliveryAddress;
    private String shippingMethodId;
    private String paymentMethodId;
    private String couponCode;
    private String cancelReason;
    private OffsetDateTime confirmedAt;
    private OffsetDateTime packedAt;
    private OffsetDateTime assignedAt;
    private OffsetDateTime shippedAt;
    private OffsetDateTime deliveredAt;
    private OffsetDateTime cancelledAt;
    private OffsetDateTime returnedAt;
    private String note;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItemJpaEntity> items = new ArrayList<>();
}
