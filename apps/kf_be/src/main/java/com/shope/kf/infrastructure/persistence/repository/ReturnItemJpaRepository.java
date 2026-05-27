package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.ReturnItemJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ReturnItemJpaRepository extends JpaRepository<ReturnItemJpaEntity, Long>, JpaSpecificationExecutor<ReturnItemJpaEntity> {
    List<ReturnItemJpaEntity> findByReturnRequestIdOrderByIdAsc(String returnRequestId);
}
