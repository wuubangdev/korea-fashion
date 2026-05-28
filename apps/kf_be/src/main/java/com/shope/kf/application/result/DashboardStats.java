package com.shope.kf.application.result;

import java.math.BigDecimal;

public record DashboardStats(
        long totalProducts,
        long totalOrders,
        long totalUsers,
        long totalCategories,
        long lowStockProducts,
        BigDecimal revenueTotal
) {
}
