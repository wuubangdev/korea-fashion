package com.shope.kf.application.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateOrderRequest {
    @NotBlank
    private String deliveryAddress;

    private String note;

    @NotEmpty
    @Valid
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        @NotNull
        private Long productId;

        private Long variantId;

        @NotNull
        @Positive
        private Integer quantity;

        @NotNull
        @PositiveOrZero
        private BigDecimal unitPrice;
    }
}
