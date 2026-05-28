package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.VariantJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VariantJpaRepository extends JpaRepository<VariantJpaEntity, Long> {
    Page<VariantJpaEntity> findBySkuContainingIgnoreCase(String sku, Pageable pageable);
    Page<VariantJpaEntity> findByProductId(Long productId, Pageable pageable);
    List<VariantJpaEntity> findByProductIdOrderByIdAsc(Long productId);

    @Modifying
    @Query(value = "delete from variants where id = :id", nativeQuery = true)
    int hardDeleteById(@Param("id") Long id);

    @Modifying
    @Query(value = "delete from variants where id in (:ids)", nativeQuery = true)
    int hardDeleteByIdIn(@Param("ids") List<Long> ids);
}
