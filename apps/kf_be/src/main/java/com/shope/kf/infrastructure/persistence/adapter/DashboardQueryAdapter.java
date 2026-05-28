package com.shope.kf.infrastructure.persistence.adapter;

import com.shope.kf.application.port.out.DashboardQueryPort;
import com.shope.kf.application.result.DashboardStats;
import com.shope.kf.domain.model.Order;
import com.shope.kf.domain.model.Product;
import com.shope.kf.infrastructure.constant.CommerceStatus;
import com.shope.kf.infrastructure.persistence.jpa.mapper.OrderMapper;
import com.shope.kf.infrastructure.persistence.jpa.mapper.ProductMapper;
import com.shope.kf.infrastructure.persistence.repository.CategoryJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.OrderJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.ProductJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.UserJpaRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DashboardQueryAdapter implements DashboardQueryPort {
    private final ProductJpaRepository productRepo;
    private final OrderJpaRepository orderRepo;
    private final UserJpaRepository userRepo;
    private final CategoryJpaRepository categoryRepo;

    public DashboardQueryAdapter(
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

    @Override
    public DashboardStats stats(int lowStockThreshold) {
        BigDecimal revenueTotal = orderRepo.sumGrandTotalByStatuses(CommerceStatus.COMPLETED, CommerceStatus.DELIVERED);
        return new DashboardStats(
                productRepo.count(),
                orderRepo.count(),
                userRepo.count(),
                categoryRepo.count(),
                productRepo.countLowStock(lowStockThreshold),
                revenueTotal == null ? BigDecimal.ZERO : revenueTotal
        );
    }

    @Override
    public List<Product> lowStockProducts(int threshold, int size) {
        return productRepo.findLowStock(threshold, PageRequest.of(0, size, Sort.by(Sort.Direction.ASC, "stockQuantity")))
                .map(ProductMapper::toDomain)
                .toList();
    }

    @Override
    public List<Order> recentOrders(int size) {
        return orderRepo.findAll(PageRequest.of(0, size, Sort.by(Sort.Direction.DESC, "orderDate")))
                .map(OrderMapper::toDomain)
                .toList();
    }
}
