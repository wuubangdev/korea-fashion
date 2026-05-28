package com.shope.kf.application.result;

import java.math.BigDecimal;

public record CouponValidationResult(
        boolean valid,
        String message,
        String code,
        BigDecimal discountAmount,
        boolean freeShipping,
        BigDecimal totalAfterDiscount
) {
}
