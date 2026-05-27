package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "promotions")
@Data
public class PromotionJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 10)
    private String id;

    @Column(length = 100)
    private String name;

    private BigDecimal discountPercent;
    private LocalDate startDate;
    private LocalDate endDate;

    @Column(length = 200)
    private String conditionText;

    @Column(length = 40)
    private String code;

    @Column(length = 40)
    private String type;

    private BigDecimal discountAmount;
    private BigDecimal minimumOrderValue;
    private Integer usageLimit;
    private Integer usedCount;
    private Boolean active;

    @Column(length = 500)
    private String bannerImageUrl;
}
