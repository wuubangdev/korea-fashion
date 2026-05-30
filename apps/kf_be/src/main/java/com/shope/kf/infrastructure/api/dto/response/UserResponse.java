package com.shope.kf.infrastructure.api.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String address;
    private String city;
    private String district;
    private String ward;
    private String avatarUrl;
    private Set<String> roles;
}
