package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.FaqJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface FaqJpaRepository extends JpaRepository<FaqJpaEntity, Long>, JpaSpecificationExecutor<FaqJpaEntity> {
    List<FaqJpaEntity> findByActiveTrueOrderByDisplayOrderAscIdAsc();
}
