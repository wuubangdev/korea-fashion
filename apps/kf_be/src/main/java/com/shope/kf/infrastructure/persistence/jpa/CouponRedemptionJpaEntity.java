package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "coupon_redemptions",
        indexes = {
                @Index(name = "idx_coupon_redemptions_coupon", columnList = "coupon_id"),
                @Index(name = "idx_coupon_redemptions_customer", columnList = "customer_id"),
                @Index(name = "idx_coupon_redemptions_order", columnList = "order_id")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class CouponRedemptionJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "coupon_id", length = 40, nullable = false)
    private String couponId;

    @Column(length = 60, nullable = false)
    private String couponCode;

    @Column(name = "order_id", length = 50)
    private String orderId;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(length = 80)
    private String guestCustomerId;

    private BigDecimal discountAmount;
    private LocalDateTime redeemedAt;
    private Boolean voided;

    @Column(length = 300)
    private String voidReason;
}
