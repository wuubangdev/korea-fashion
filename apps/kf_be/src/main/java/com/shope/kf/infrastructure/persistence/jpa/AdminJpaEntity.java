package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "admins")
@Data
public class AdminJpaEntity {
    @Id
    @Column(length = 10)
    private String id;

    @Column(length = 50)
    private String fullName;

    @Column(length = 30)
    private String position;
}
