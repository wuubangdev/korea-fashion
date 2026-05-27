package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.ProductJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProductJpaRepository extends JpaRepository<ProductJpaEntity, Long>, JpaSpecificationExecutor<ProductJpaEntity> {
    Page<ProductJpaEntity> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Optional<ProductJpaEntity> findBySlug(String slug);

    @Modifying
    @Query(value = "delete from products where id = :id", nativeQuery = true)
    int hardDeleteById(@Param("id") Long id);

    @Query("select count(p) from ProductJpaEntity p where p.stockQuantity is not null and p.stockQuantity <= :threshold")
    long countLowStock(@Param("threshold") int threshold);

    @Query("select p from ProductJpaEntity p where p.stockQuantity is not null and p.stockQuantity <= :threshold")
    Page<ProductJpaEntity> findLowStock(@Param("threshold") int threshold, Pageable pageable);
}
