package com.shope.kf.application.port.in;

import com.shope.kf.domain.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderUseCase {
    Order create(Order order);
    Order updateStatus(Long id, String status);
    Order assignShipper(Long id, String shipperId);
    Order updateShippingStatus(Long id, String shippingStatus);
    void delete(Long id);
    Order findById(Long id);
    Page<Order> list(String search, Pageable pageable);
    Page<Order> listByShipper(String shipperId, Pageable pageable);
}
