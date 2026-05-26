package com.shope.kf.application.service;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.in.OrderUseCase;
import com.shope.kf.application.port.out.OrderPersistencePort;
import com.shope.kf.application.port.out.ShipperPersistencePort;
import com.shope.kf.domain.model.Order;

import java.time.OffsetDateTime;
import java.util.Set;

public class OrderService implements OrderUseCase {
    private static final Set<String> SHIPPING_STATUSES = Set.of("PENDING", "ASSIGNED", "SHIPPING", "DELIVERED", "FAILED", "CANCELLED");

    private final OrderPersistencePort port;
    private final ShipperPersistencePort shipperPort;

    public OrderService(OrderPersistencePort port, ShipperPersistencePort shipperPort) {
        this.port = port;
        this.shipperPort = shipperPort;
    }

    @Override
    public Order create(Order order) {
        order.setShippingStatus("PENDING");
        return port.save(order);
    }

    @Override
    public Order updateStatus(Long id, String status) {
        Order existing = port.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        existing.setStatus(status);
        return port.save(existing);
    }

    @Override
    public Order assignShipper(Long id, String shipperId) {
        if (!shipperPort.existsById(shipperId)) {
            throw new RuntimeException("Shipper not found");
        }
        Order existing = findById(id);
        existing.setShipperId(shipperId);
        existing.setShippingStatus("ASSIGNED");
        existing.setAssignedAt(OffsetDateTime.now());
        return port.save(existing);
    }

    @Override
    public Order updateShippingStatus(Long id, String shippingStatus) {
        String normalizedStatus = shippingStatus.toUpperCase();
        if (!SHIPPING_STATUSES.contains(normalizedStatus)) {
            throw new RuntimeException("Invalid shipping status");
        }
        Order existing = findById(id);
        if (!"PENDING".equals(normalizedStatus) && existing.getShipperId() == null) {
            throw new RuntimeException("Order has not been assigned to a shipper");
        }
        existing.setShippingStatus(normalizedStatus);
        if ("SHIPPING".equals(normalizedStatus)) {
            existing.setShippedAt(OffsetDateTime.now());
            existing.setStatus("SHIPPING");
        } else if ("DELIVERED".equals(normalizedStatus)) {
            existing.setDeliveredAt(OffsetDateTime.now());
            existing.setStatus("COMPLETED");
        } else if ("FAILED".equals(normalizedStatus) || "CANCELLED".equals(normalizedStatus)) {
            existing.setStatus(normalizedStatus);
        }
        return port.save(existing);
    }

    @Override
    public void delete(Long id) {
        port.deleteById(id);
    }

    @Override
    public Order findById(Long id) {
        return port.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Override
    public PageResult<Order> list(String search, PageQuery pageQuery) {
        return port.findAll(search, pageQuery);
    }

    @Override
    public PageResult<Order> listByShipper(String shipperId, PageQuery pageQuery) {
        if (!shipperPort.existsById(shipperId)) {
            throw new RuntimeException("Shipper not found");
        }
        return port.findByShipperId(shipperId, pageQuery);
    }
}
