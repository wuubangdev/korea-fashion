package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.MenuItemJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface MenuItemJpaRepository extends JpaRepository<MenuItemJpaEntity, Long>, JpaSpecificationExecutor<MenuItemJpaEntity> {
    List<MenuItemJpaEntity> findByMenuIdAndActiveTrueOrderByDisplayOrderAscIdAsc(String menuId);
}
