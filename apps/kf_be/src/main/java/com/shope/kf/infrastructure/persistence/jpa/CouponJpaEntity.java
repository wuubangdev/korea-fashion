package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "coupons",
        indexes = {
                @Index(name = "idx_coupons_code", columnList = "code", unique = true),
                @Index(name = "idx_coupons_active_dates", columnList = "active,starts_at,ends_at")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class CouponJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 40)
    private String id;

    @Column(length = 60, nullable = false)
    @NotBlank
    private String code;

    @Column(length = 160, nullable = false)
    @NotBlank
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(length = 30, nullable = false)
    @NotBlank
    private String discountType;

    private BigDecimal discountValue;
    private BigDecimal maxDiscountAmount;
    private BigDecimal minOrderAmount;

    @Column(length = 30)
    private String appliesTo;

    @Column(length = 1000)
    private String productIds;

    @Column(length = 1000)
    private String categoryIds;

    @Column(length = 1000)
    private String customerIds;

    private Integer usageLimit;
    private Integer usageLimitPerCustomer;
    private Integer usedCount;
    private Boolean stackable;
    private Boolean freeShipping;
    private Boolean active;

    @Column(name = "starts_at")
    private LocalDateTime startsAt;

    @Column(name = "ends_at")
    private LocalDateTime endsAt;
}
