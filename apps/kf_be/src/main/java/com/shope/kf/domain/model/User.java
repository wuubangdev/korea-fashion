package com.shope.kf.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    private Long id;
    private String username;
    private String password;
    private String email;
    private String fullName;
    private String phone;
    private String address;
    private String city;
    private String district;
    private String ward;
    private String avatarUrl;
    private Set<Role> roles;
}
