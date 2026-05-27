package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "colors")
@Data
@EqualsAndHashCode(callSuper = false)
public class ColorJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 5)
    private String id;

    @Column(length = 20)
    private String name;

    @Column(length = 20)
    private String hexCode;

    @Column(length = 80)
    private String displayName;

    private Integer displayOrder;
    private Boolean active;
}
