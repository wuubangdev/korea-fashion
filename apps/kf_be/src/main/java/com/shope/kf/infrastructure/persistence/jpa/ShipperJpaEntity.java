package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "shippers")
@Data
@EqualsAndHashCode(callSuper = false)
public class ShipperJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 10)
    private String id;

    @Column(length = 50)
    private String fullName;

    @Column(length = 12)
    private String phone;

    @Column(length = 30)
    private String vehicle;

    @Column(length = 50)
    private String area;

    @Column(length = 20)
    private String status;
}
