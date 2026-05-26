package com.shope.kf.infrastructure.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateProductRequest {
	@NotBlank
	@Size(max = 200)
	private String name;

	@Size(max = 1000)
	private String description;

	private String imageUrl;

	@NotNull
	private BigDecimal price;

	private String brand;
	private String origin;
}
