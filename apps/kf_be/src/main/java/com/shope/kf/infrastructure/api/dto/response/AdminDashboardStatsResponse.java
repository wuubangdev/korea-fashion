package com.shope.kf.infrastructure.api.dto.response;

import java.math.BigDecimal;

public record AdminDashboardStatsResponse(
        long totalProducts,
        long totalOrders,
        long totalUsers,
        long totalCategories,
        long lowStockProducts,
        BigDecimal revenueTotal
) {
}
