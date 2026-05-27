package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "sizes")
@Data
public class SizeJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 5)
    private String id;

    @Column(length = 10)
    private String name;

    @Column(length = 30)
    private String groupName;

    @Column(length = 20)
    private String region;

    @Column(length = 300)
    private String measurementGuide;

    private Integer displayOrder;
    private Boolean active;
}
