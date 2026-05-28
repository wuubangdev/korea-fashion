package com.shope.kf.application.result;

import java.math.BigDecimal;

public record CouponValidationCommand(
        String code,
        BigDecimal subtotal,
        Long customerId
) {
}
