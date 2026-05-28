package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.CategoryJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CategoryJpaRepository extends JpaRepository<CategoryJpaEntity, Long> {
    Page<CategoryJpaEntity> findByNameContainingIgnoreCase(String name, Pageable pageable);
    List<CategoryJpaEntity> findByActiveTrueOrderByDisplayOrderAscIdAsc();

    @Modifying
    @Query(value = "delete from categories where id = :id", nativeQuery = true)
    int hardDeleteById(@Param("id") Long id);

    @Modifying
    @Query(value = "delete from categories where id in (:ids)", nativeQuery = true)
    int hardDeleteByIdIn(@Param("ids") List<Long> ids);
}
