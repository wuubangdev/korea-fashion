package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.CartJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CartJpaRepository extends JpaRepository<CartJpaEntity, String>, JpaSpecificationExecutor<CartJpaEntity> {
}
