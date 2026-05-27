package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(
        name = "menus",
        indexes = {
                @Index(name = "idx_menus_code", columnList = "code", unique = true),
                @Index(name = "idx_menus_active", columnList = "active")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class MenuJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 50)
    private String id;

    @Column(length = 80, nullable = false)
    @NotBlank
    private String code;

    @Column(length = 120, nullable = false)
    @NotBlank
    private String name;

    @Column(length = 40)
    private String placement;

    private Boolean active;
}
