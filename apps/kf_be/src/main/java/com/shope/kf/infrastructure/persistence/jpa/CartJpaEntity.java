package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "carts")
@Data
@EqualsAndHashCode(callSuper = false)
public class CartJpaEntity extends BaseJpaEntity {
    @Id
    private String id;
}
