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
        name = "customer_addresses",
        indexes = {
                @Index(name = "idx_customer_addresses_customer", columnList = "customer_id"),
                @Index(name = "idx_customer_addresses_default", columnList = "customer_id,default_address")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class CustomerAddressJpaEntity extends BaseJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(length = 80)
    private String guestCustomerId;

    @Column(length = 120)
    private String fullName;

    @Column(length = 30)
    private String phone;

    @Column(length = 160)
    private String email;

    @Column(length = 300)
    private String addressLine1;

    @Column(length = 300)
    private String addressLine2;

    @Column(length = 120)
    private String ward;

    @Column(length = 120)
    private String district;

    @Column(length = 120)
    private String province;

    @Column(length = 120)
    private String country;

    @Column(length = 20)
    private String postalCode;

    @Column(length = 40)
    private String addressType;

    @Column(name = "default_address")
    private Boolean defaultAddress;

    @Column(length = 500)
    private String note;
}
