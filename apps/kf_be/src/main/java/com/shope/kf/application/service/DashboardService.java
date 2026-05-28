package com.shope.kf.application.service;

import com.shope.kf.application.port.in.DashboardUseCase;
import com.shope.kf.application.port.out.DashboardQueryPort;
import com.shope.kf.application.result.DashboardStats;
import com.shope.kf.domain.model.Order;
import com.shope.kf.domain.model.Product;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional(readOnly = true)
public class DashboardService implements DashboardUseCase {
    private final DashboardQueryPort dashboardQueryPort;

    public DashboardService(DashboardQueryPort dashboardQueryPort) {
        this.dashboardQueryPort = dashboardQueryPort;
    }

    @Override
    public DashboardStats stats(int lowStockThreshold) {
        return dashboardQueryPort.stats(lowStockThreshold);
    }

    @Override
    public List<Product> lowStockProducts(int threshold, int size) {
        return dashboardQueryPort.lowStockProducts(threshold, size);
    }

    @Override
    public List<Order> recentOrders(int size) {
        return dashboardQueryPort.recentOrders(size);
    }
}
