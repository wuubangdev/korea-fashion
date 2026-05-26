package com.shope.kf.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateCategoryRequest {
    @NotBlank
    @Size(max = 50)
    private String code;

    @NotBlank
    @Size(max = 200)
    private String name;

    @Size(max = 1000)
    private String description;
}
