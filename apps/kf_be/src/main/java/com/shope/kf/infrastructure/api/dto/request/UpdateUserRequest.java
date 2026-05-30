package com.shope.kf.infrastructure.api.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class UpdateUserRequest {
    @Size(max = 50, message = "Username must be at most 50 characters")
    private String username;

    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    private String password;

    @Email(message = "Email is invalid")
    @Size(max = 100, message = "Email must be at most 100 characters")
    private String email;

    @Size(max = 120, message = "Full name must be at most 120 characters")
    private String fullName;

    @Size(max = 30, message = "Phone must be at most 30 characters")
    private String phone;

    @Size(max = 500, message = "Address must be at most 500 characters")
    private String address;

    @Size(max = 120, message = "City must be at most 120 characters")
    private String city;

    @Size(max = 120, message = "District must be at most 120 characters")
    private String district;

    @Size(max = 120, message = "Ward must be at most 120 characters")
    private String ward;

    @Size(max = 500, message = "Avatar URL must be at most 500 characters")
    private String avatarUrl;

    private Set<String> roles;
}
