package com.shope.kf.infrastructure.api;

import com.shope.kf.application.port.in.DashboardUseCase;
import com.shope.kf.infrastructure.api.dto.response.AdminDashboardStatsResponse;
import com.shope.kf.infrastructure.api.mapper.OrderApiMapper;
import com.shope.kf.infrastructure.api.mapper.ProductApiMapper;
import com.shope.kf.application.result.DashboardStats;
import com.shope.kf.infrastructure.security.RequireAuth;
import com.shope.kf.infrastructure.security.RoleConstants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequireAuth(roles = {RoleConstants.ADMIN, RoleConstants.STAFF})
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {
    private final DashboardUseCase dashboardUseCase;

    public AdminDashboardController(DashboardUseCase dashboardUseCase) {
        this.dashboardUseCase = dashboardUseCase;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardStatsResponse> stats(@RequestParam(defaultValue = "5") int lowStockThreshold) {
        DashboardStats stats = dashboardUseCase.stats(lowStockThreshold);
        return ResponseEntity.ok(new AdminDashboardStatsResponse(
                stats.totalProducts(),
                stats.totalOrders(),
                stats.totalUsers(),
                stats.totalCategories(),
                stats.lowStockProducts(),
                stats.revenueTotal()
        ));
    }

    @GetMapping("/low-stock-products")
    public ResponseEntity<?> lowStockProducts(
            @RequestParam(defaultValue = "5") int threshold,
            @RequestParam(defaultValue = "10") int size
    ) {
        var products = dashboardUseCase.lowStockProducts(threshold, size).stream()
                .map(ProductApiMapper::toResponse)
                .toList();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/recent-orders")
    public ResponseEntity<?> recentOrders(@RequestParam(defaultValue = "10") int size) {
        var orders = dashboardUseCase.recentOrders(size).stream()
                .map(OrderApiMapper::toResponse)
                .toList();
        return ResponseEntity.ok(orders);
    }
}
