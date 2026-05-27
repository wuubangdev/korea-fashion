package com.shope.kf.application.service;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.in.OrderUseCase;
import com.shope.kf.application.port.out.OrderPersistencePort;
import com.shope.kf.application.port.out.ShipperPersistencePort;
import com.shope.kf.domain.model.Order;
import com.shope.kf.infrastructure.exception.AppException;
import com.shope.kf.infrastructure.exception.ErrorCode;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Set;

@Transactional
public class OrderService implements OrderUseCase {
    private static final Set<String> SHIPPING_STATUSES = Set.of("PENDING", "ASSIGNED", "SHIPPING", "DELIVERED", "FAILED", "CANCELLED");

    private final OrderPersistencePort port;
    private final ShipperPersistencePort shipperPort;
    private final InventoryService inventoryService;

    public OrderService(OrderPersistencePort port, ShipperPersistencePort shipperPort, InventoryService inventoryService) {
        this.port = port;
        this.shipperPort = shipperPort;
        this.inventoryService = inventoryService;
    }

    @Override
    public Order create(Order order) {
        if (order.getOrderCode() == null || order.getOrderCode().isBlank()) {
            order.setOrderCode("KF" + System.currentTimeMillis());
        }
        order.setShippingStatus("PENDING");
        inventoryService.reserveOrder(order);
        return port.save(order);
    }

    @Override
    public Order updateStatus(Long id, String status) {
        Order existing = port.findById(id).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Order not found"));
        existing.setStatus(status);
        return port.save(existing);
    }

    @Override
    public Order assignShipper(Long id, String shipperId) {
        if (!shipperPort.existsById(shipperId)) {
            throw new AppException(ErrorCode.NOT_FOUND, "Shipper not found");
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
            throw new AppException(ErrorCode.BAD_REQUEST, "Invalid shipping status");
        }
        Order existing = findById(id);
        String previousStatus = existing.getShippingStatus();
        if (!"PENDING".equals(normalizedStatus) && existing.getShipperId() == null) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Order has not been assigned to a shipper");
        }
        existing.setShippingStatus(normalizedStatus);
        if ("SHIPPING".equals(normalizedStatus)) {
            existing.setShippedAt(OffsetDateTime.now());
            existing.setStatus("SHIPPING");
        } else if ("DELIVERED".equals(normalizedStatus)) {
            if (!"DELIVERED".equalsIgnoreCase(previousStatus)) {
                inventoryService.fulfillOrder(existing);
            }
            existing.setDeliveredAt(OffsetDateTime.now());
            existing.setStatus("COMPLETED");
        } else if ("FAILED".equals(normalizedStatus) || "CANCELLED".equals(normalizedStatus)) {
            if (!"FAILED".equalsIgnoreCase(previousStatus) && !"CANCELLED".equalsIgnoreCase(previousStatus)) {
                inventoryService.releaseOrder(existing);
            }
            existing.setStatus(normalizedStatus);
            if ("CANCELLED".equals(normalizedStatus)) {
                existing.setCancelledAt(OffsetDateTime.now());
            }
        }
        return port.save(existing);
    }

    @Override
    public void delete(Long id) {
        port.deleteById(id);
    }

    @Override
    public void hardDelete(Long id) {
        port.hardDeleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Order findById(Long id) {
        return port.findById(id).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Order not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<Order> list(String search, PageQuery pageQuery) {
        return port.findAll(search, pageQuery);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<Order> listByShipper(String shipperId, PageQuery pageQuery) {
        if (!shipperPort.existsById(shipperId)) {
            throw new AppException(ErrorCode.NOT_FOUND, "Shipper not found");
        }
        return port.findByShipperId(shipperId, pageQuery);
    }
}
