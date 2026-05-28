package com.shope.kf.application.port.in;

import com.shope.kf.application.result.DashboardStats;
import com.shope.kf.domain.model.Order;
import com.shope.kf.domain.model.Product;

import java.util.List;

public interface DashboardUseCase {
    DashboardStats stats(int lowStockThreshold);

    List<Product> lowStockProducts(int threshold, int size);

    List<Order> recentOrders(int size);
}
