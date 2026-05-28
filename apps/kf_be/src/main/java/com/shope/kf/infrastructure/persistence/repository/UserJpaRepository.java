package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.UserJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserJpaRepository extends JpaRepository<UserJpaEntity, Long> {
    Optional<UserJpaEntity> findByUsername(String username);
    Page<UserJpaEntity> findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(String username, String email, Pageable pageable);

    @Modifying
    @Query(value = "delete from users where id = :id", nativeQuery = true)
    int hardDeleteById(@Param("id") Long id);

    @Modifying
    @Query(value = "delete from users where id in (:ids)", nativeQuery = true)
    int hardDeleteByIdIn(@Param("ids") List<Long> ids);

    @Modifying
    @Query(value = "delete from user_roles where user_id = :id", nativeQuery = true)
    int hardDeleteRolesByUserId(@Param("id") Long id);

    @Modifying
    @Query(value = "delete from user_roles where user_id in (:ids)", nativeQuery = true)
    int hardDeleteRolesByUserIdIn(@Param("ids") List<Long> ids);
}
