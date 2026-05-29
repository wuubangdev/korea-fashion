package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.ContactMessageJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ContactMessageJpaRepository extends JpaRepository<ContactMessageJpaEntity, Long>, JpaSpecificationExecutor<ContactMessageJpaEntity> {
}
