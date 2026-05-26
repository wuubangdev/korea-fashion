package com.shope.kf.infrastructure.persistence.jpa.mapper;

import com.shope.kf.domain.model.Role;
import com.shope.kf.infrastructure.persistence.jpa.RoleJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.RoleJpaRepository;

public final class RoleMapper {
    private RoleMapper() {
    }

    public static Role toDomain(RoleJpaEntity entity) {
        if (entity == null) {
            return null;
        }
        return new Role(entity.getId(), entity.getName());
    }

    public static RoleJpaEntity toEntity(Role role, RoleJpaRepository repository) {
        if (role == null) {
            return null;
        }
        if (role.getId() != null) {
            return repository.findById(role.getId())
                    .orElseThrow(() -> new RuntimeException("Role not found"));
        }
        return repository.findByName(role.getName())
                .orElseThrow(() -> new RuntimeException("Role not found"));
    }
}
