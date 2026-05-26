package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "sizes")
@Data
public class SizeJpaEntity {
    @Id
    @Column(length = 5)
    private String id;

    @Column(length = 10)
    private String name;
}
