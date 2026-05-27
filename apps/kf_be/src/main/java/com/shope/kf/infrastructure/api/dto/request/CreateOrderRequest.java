package com.shope.kf.infrastructure.api.dto.request;

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
    private Long customerId;
    private String guestCustomerId;
    private String customerName;
    private String customerPhone;
    private String customerEmail;

    @NotBlank
    private String deliveryAddress;

    private BigDecimal discountTotal;
    private BigDecimal shippingFee;
    private BigDecimal taxTotal;
    private String shippingMethodId;
    private String paymentMethodId;
    private String couponCode;
    private String note;

    @NotEmpty
    @Valid
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        @NotNull
        private Long productId;

        private Long variantId;
        private String productName;
        private String productImageUrl;
        private String sku;
        private String size;
        private String color;

        @NotNull
        @Positive
        private Integer quantity;

        @NotNull
        @PositiveOrZero
        private BigDecimal unitPrice;

        private BigDecimal price;
        private BigDecimal discount;
    }
}
