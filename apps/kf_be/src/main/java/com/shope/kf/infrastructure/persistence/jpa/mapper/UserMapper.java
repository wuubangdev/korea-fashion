package com.shope.kf.infrastructure.persistence.jpa.mapper;

import com.shope.kf.domain.model.User;
import com.shope.kf.infrastructure.persistence.jpa.UserJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.RoleJpaRepository;

import java.util.stream.Collectors;

public final class UserMapper {
    private UserMapper() {
    }

    public static User toDomain(UserJpaEntity entity) {
        if (entity == null) {
            return null;
        }
        return User.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .password(entity.getPassword())
                .email(entity.getEmail())
                .fullName(entity.getFullName())
                .phone(entity.getPhone())
                .address(entity.getAddress())
                .city(entity.getCity())
                .district(entity.getDistrict())
                .ward(entity.getWard())
                .avatarUrl(entity.getAvatarUrl())
                .roles(entity.getRoles().stream().map(RoleMapper::toDomain).collect(Collectors.toSet()))
                .build();
    }

    public static UserJpaEntity toEntity(User user, RoleJpaRepository roleRepository) {
        if (user == null) {
            return null;
        }
        UserJpaEntity entity = new UserJpaEntity();
        entity.setId(user.getId());
        entity.setUsername(user.getUsername());
        entity.setPassword(user.getPassword());
        entity.setEmail(user.getEmail());
        entity.setFullName(user.getFullName());
        entity.setPhone(user.getPhone());
        entity.setAddress(user.getAddress());
        entity.setCity(user.getCity());
        entity.setDistrict(user.getDistrict());
        entity.setWard(user.getWard());
        entity.setAvatarUrl(user.getAvatarUrl());
        if (user.getRoles() != null) {
            entity.setRoles(user.getRoles().stream()
                    .map(role -> RoleMapper.toEntity(role, roleRepository))
                    .collect(Collectors.toSet()));
        }
        return entity;
    }
}
