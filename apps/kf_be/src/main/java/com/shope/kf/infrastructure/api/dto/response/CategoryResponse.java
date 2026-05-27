package com.shope.kf.infrastructure.api.dto.response;

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
    private String slug;
    private String imageUrl;
    private String bannerImageUrl;
    private Long parentId;
    private Integer displayOrder;
    private Boolean active;
    private String seoTitle;
    private String seoDescription;
}
