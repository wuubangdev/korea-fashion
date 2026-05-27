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
        name = "menu_items",
        indexes = {
                @Index(name = "idx_menu_items_menu", columnList = "menu_id,parent_id,display_order"),
                @Index(name = "idx_menu_items_active", columnList = "active")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class MenuItemJpaEntity extends BaseJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "menu_id", length = 50, nullable = false)
    private String menuId;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(length = 120, nullable = false)
    private String label;

    @Column(length = 500)
    private String url;

    @Column(length = 40)
    private String targetType;

    @Column(length = 80)
    private String targetId;

    @Column(length = 80)
    private String icon;

    private Integer displayOrder;
    private Boolean active;
}
