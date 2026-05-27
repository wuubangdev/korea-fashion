package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.StorePolicyJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface StorePolicyJpaRepository extends JpaRepository<StorePolicyJpaEntity, String>, JpaSpecificationExecutor<StorePolicyJpaEntity> {
    List<StorePolicyJpaEntity> findByActiveTrueOrderByDisplayOrderAscIdAsc();
    Optional<StorePolicyJpaEntity> findBySlugAndActiveTrue(String slug);
}
