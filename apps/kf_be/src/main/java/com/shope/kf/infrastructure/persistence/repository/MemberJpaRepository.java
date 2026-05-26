package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.MemberJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MemberJpaRepository extends JpaRepository<MemberJpaEntity, String>, JpaSpecificationExecutor<MemberJpaEntity> {
}
