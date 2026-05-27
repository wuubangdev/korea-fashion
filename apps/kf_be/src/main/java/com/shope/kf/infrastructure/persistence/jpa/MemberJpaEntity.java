package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "members")
@Data
public class MemberJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 10)
    private String id;

    @Column(length = 50)
    private String fullName;

    private LocalDate birthDate;

    @Column(length = 5)
    private String gender;

    @Column(length = 100)
    private String address;

    @Column(length = 12)
    private String phone;

    private Integer points;
}
