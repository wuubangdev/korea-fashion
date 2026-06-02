package com.shope.kf.application.service;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.in.OrderUseCase;
import com.shope.kf.application.port.out.OrderPersistencePort;
import com.shope.kf.application.port.out.ShipperPersistencePort;
import com.shope.kf.domain.exception.DomainException;
import com.shope.kf.domain.model.Order;
import com.shope.kf.infrastructure.exception.AppException;
import com.shope.kf.infrastructure.exception.ErrorCode;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.OffsetDateTime;

@Transactional
public class OrderService implements OrderUseCase {
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
        order.prepareForCreation("KF" + System.currentTimeMillis(), OffsetDateTime.now());
        inventoryService.reserveOrder(order);
        return port.save(order);
    }

    @Override
    public Order copy(Long id) {
        Order order = findById(id);
        order.setId(null);
        order.setOrderCode(null);
        if (order.getItems() != null) {
            order.getItems().forEach(item -> item.setId(null));
        }
        return create(order);
    }

    @Override
    public Order updateStatus(Long id, String status) {
        Order existing = port.findById(id).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Order not found"));
        try {
            existing.changeStatus(status);
        } catch (DomainException ex) {
            throw new AppException(ErrorCode.BAD_REQUEST, ex.getMessage());
        }
        return port.save(existing);
    }

    @Override
    public Order updatePaymentStatus(Long id, String paymentStatus) {
        Order existing = findById(id);
        try {
            existing.changePaymentStatus(paymentStatus, OffsetDateTime.now());
        } catch (DomainException ex) {
            throw new AppException(ErrorCode.BAD_REQUEST, ex.getMessage());
        }
        return port.save(existing);
    }

    @Override
    public Order assignShipper(Long id, String shipperId) {
        if (!shipperPort.existsById(shipperId)) {
            throw new AppException(ErrorCode.NOT_FOUND, "Shipper not found");
        }
        Order existing = findById(id);
        existing.assignShipper(shipperId, OffsetDateTime.now());
        return port.save(existing);
    }

    @Override
    public Order updateShippingStatus(Long id, String shippingStatus) {
        Order existing = findById(id);
        Order.ShippingInventoryEffect inventoryEffect;
        try {
            inventoryEffect = existing.changeShippingStatus(shippingStatus, OffsetDateTime.now());
        } catch (DomainException ex) {
            throw new AppException(ErrorCode.BAD_REQUEST, ex.getMessage());
        }
        if (inventoryEffect == Order.ShippingInventoryEffect.FULFILL) {
            inventoryService.fulfillOrder(existing);
        } else if (inventoryEffect == Order.ShippingInventoryEffect.RELEASE) {
            inventoryService.releaseOrder(existing);
        }
        return port.save(existing);
    }

    @Override
    public void delete(Long id) {
        port.deleteById(id);
    }

    @Override
    public void deleteAll(List<Long> ids) {
        port.deleteAllById(ids);
    }

    @Override
    public void restore(Long id) {
        port.restoreById(id);
    }

    @Override
    public void restoreAll(List<Long> ids) {
        port.restoreAllById(ids);
    }

    @Override
    public void hardDelete(Long id) {
        port.hardDeleteById(id);
    }

    @Override
    public void hardDeleteAll(List<Long> ids) {
        port.hardDeleteAllById(ids);
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
    public PageResult<Order> trash(String search, PageQuery pageQuery) {
        return port.findDeleted(search, pageQuery);
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
