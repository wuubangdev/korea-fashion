package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.CartItemJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CartItemJpaRepository extends JpaRepository<CartItemJpaEntity, Long>, JpaSpecificationExecutor<CartItemJpaEntity> {
}
