package com.shope.kf.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {
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
