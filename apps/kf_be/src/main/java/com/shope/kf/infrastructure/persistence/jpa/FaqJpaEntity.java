package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(
        name = "faqs",
        indexes = {
                @Index(name = "idx_faqs_category", columnList = "category,display_order"),
                @Index(name = "idx_faqs_active", columnList = "active")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class FaqJpaEntity extends BaseJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 120)
    private String category;

    @Column(length = 300, nullable = false)
    private String question;

    @Column(length = 2000)
    private String answer;

    private Integer displayOrder;
    private Boolean active;
}
