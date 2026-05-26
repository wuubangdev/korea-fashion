package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "shippers")
@Data
public class ShipperJpaEntity {
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
