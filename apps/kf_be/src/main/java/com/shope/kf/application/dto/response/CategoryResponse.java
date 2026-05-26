package com.shope.kf.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class CategoryResponse {
    private Long id;
    private String code;
    private String name;
    private String description;
}
