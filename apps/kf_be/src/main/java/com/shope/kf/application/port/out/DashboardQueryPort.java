package com.shope.kf.application.port.out;

import com.shope.kf.application.result.DashboardStats;
import com.shope.kf.domain.model.Order;
import com.shope.kf.domain.model.Product;

import java.util.List;

public interface DashboardQueryPort {
    DashboardStats stats(int lowStockThreshold);

    List<Product> lowStockProducts(int threshold, int size);

    List<Order> recentOrders(int size);
}
