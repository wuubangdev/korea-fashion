package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "guest_customers")
@Data
public class GuestCustomerJpaEntity {
    @Id
    @Column(length = 10)
    private String id;

    @Column(length = 50)
    private String fullName;

    @Column(length = 12)
    private String phone;

    @Column(length = 100)
    private String address;

    @Column(length = 50)
    private String email;
}
