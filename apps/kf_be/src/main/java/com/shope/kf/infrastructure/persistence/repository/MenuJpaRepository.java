package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.MenuJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface MenuJpaRepository extends JpaRepository<MenuJpaEntity, String>, JpaSpecificationExecutor<MenuJpaEntity> {
    Optional<MenuJpaEntity> findByCodeAndActiveTrue(String code);
}
