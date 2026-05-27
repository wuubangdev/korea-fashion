package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.OffsetDateTime;

@Entity
@Table(name = "carts")
@Data
public class CartJpaEntity extends BaseJpaEntity {
    @Id
    private String id;
    private OffsetDateTime createdAt;
}
