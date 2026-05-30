package com.shope.kf.infrastructure.api.mapper;

import com.shope.kf.infrastructure.api.dto.request.CreateUserRequest;
import com.shope.kf.infrastructure.api.dto.request.UpdateUserRequest;
import com.shope.kf.infrastructure.api.dto.response.UserResponse;
import com.shope.kf.domain.model.Role;
import com.shope.kf.domain.model.User;

import java.util.Set;
import java.util.stream.Collectors;

public final class UserApiMapper {
    private UserApiMapper() {
    }

    public static User toDomain(CreateUserRequest request) {
        return User.builder()
                .username(request.getUsername())
                .password(request.getPassword())
                .email(request.getEmail())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .address(request.getAddress())
                .city(request.getCity())
                .district(request.getDistrict())
                .ward(request.getWard())
                .avatarUrl(request.getAvatarUrl())
                .roles(toRoles(request.getRoles()))
                .build();
    }

    public static User toDomain(UpdateUserRequest request) {
        return User.builder()
                .username(request.getUsername())
                .password(request.getPassword())
                .email(request.getEmail())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .address(request.getAddress())
                .city(request.getCity())
                .district(request.getDistrict())
                .ward(request.getWard())
                .avatarUrl(request.getAvatarUrl())
                .roles(toRoles(request.getRoles()))
                .build();
    }

    public static UserResponse toResponse(User user) {
        Set<String> roles = user.getRoles() == null ? Set.of() : user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .address(user.getAddress())
                .city(user.getCity())
                .district(user.getDistrict())
                .ward(user.getWard())
                .avatarUrl(user.getAvatarUrl())
                .roles(roles)
                .build();
    }

    private static Set<Role> toRoles(Set<String> roleNames) {
        if (roleNames == null) {
            return null;
        }
        return roleNames.stream()
                .map(name -> Role.builder().name(name).build())
                .collect(Collectors.toSet());
    }
}
