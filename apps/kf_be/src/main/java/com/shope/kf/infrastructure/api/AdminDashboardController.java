package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.api.dto.response.AdminDashboardStatsResponse;
import com.shope.kf.infrastructure.api.dto.response.OrderResponse;
import com.shope.kf.infrastructure.api.dto.response.ProductResponse;
import com.shope.kf.infrastructure.api.mapper.OrderApiMapper;
import com.shope.kf.infrastructure.api.mapper.ProductApiMapper;
import com.shope.kf.infrastructure.persistence.jpa.mapper.OrderMapper;
import com.shope.kf.infrastructure.persistence.jpa.mapper.ProductMapper;
import com.shope.kf.infrastructure.persistence.repository.CategoryJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.OrderJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.ProductJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.UserJpaRepository;
import com.shope.kf.infrastructure.security.RequireAuth;
import com.shope.kf.infrastructure.security.RoleConstants;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequireAuth(roles = {RoleConstants.ADMIN, RoleConstants.STAFF})
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {
    private final ProductJpaRepository productRepo;
    private final OrderJpaRepository orderRepo;
    private final UserJpaRepository userRepo;
    private final CategoryJpaRepository categoryRepo;

    public AdminDashboardController(
            ProductJpaRepository productRepo,
            OrderJpaRepository orderRepo,
            UserJpaRepository userRepo,
            CategoryJpaRepository categoryRepo
    ) {
        this.productRepo = productRepo;
        this.orderRepo = orderRepo;
        this.userRepo = userRepo;
        this.categoryRepo = categoryRepo;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardStatsResponse> stats(@RequestParam(defaultValue = "5") int lowStockThreshold) {
        BigDecimal revenueTotal = orderRepo.sumGrandTotalByStatuses("COMPLETED", "DELIVERED");
        return ResponseEntity.ok(new AdminDashboardStatsResponse(
                productRepo.count(),
                orderRepo.count(),
                userRepo.count(),
                categoryRepo.count(),
                productRepo.countLowStock(lowStockThreshold),
                revenueTotal == null ? BigDecimal.ZERO : revenueTotal
        ));
    }

    @GetMapping("/low-stock-products")
    public ResponseEntity<?> lowStockProducts(
            @RequestParam(defaultValue = "5") int threshold,
            @RequestParam(defaultValue = "10") int size
    ) {
        var products = productRepo.findLowStock(threshold, PageRequest.of(0, size, Sort.by(Sort.Direction.ASC, "stockQuantity")))
                .map(ProductMapper::toDomain)
                .map(ProductApiMapper::toResponse)
                .toList();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/recent-orders")
    public ResponseEntity<?> recentOrders(@RequestParam(defaultValue = "10") int size) {
        var orders = orderRepo.findAll(PageRequest.of(0, size, Sort.by(Sort.Direction.DESC, "orderDate")))
                .map(OrderMapper::toDomain)
                .map(OrderApiMapper::toResponse)
                .toList();
        return ResponseEntity.ok(orders);
    }
}
