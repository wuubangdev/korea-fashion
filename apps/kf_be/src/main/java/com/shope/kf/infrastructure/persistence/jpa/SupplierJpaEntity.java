package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "suppliers")
@Data
public class SupplierJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 10)
    private String id;

    @Column(length = 50)
    private String name;

    @Column(length = 100)
    private String address;

    @Column(length = 12)
    private String phone;

    @Column(length = 50)
    private String email;

    @Column(length = 80)
    private String contactPerson;

    @Column(length = 80)
    private String country;

    @Column(length = 80)
    private String city;

    @Column(length = 100)
    private String website;

    @Column(length = 30)
    private String status;

    @Column(length = 500)
    private String note;
}
