package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.GuestCustomerJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface GuestCustomerJpaRepository extends JpaRepository<GuestCustomerJpaEntity, String>, JpaSpecificationExecutor<GuestCustomerJpaEntity> {
}
