package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "colors")
@Data
public class ColorJpaEntity {
    @Id
    @Column(length = 5)
    private String id;

    @Column(length = 20)
    private String name;
}
