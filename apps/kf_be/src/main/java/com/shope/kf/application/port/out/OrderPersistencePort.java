package com.shope.kf.application.port.out;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.domain.model.Order;

import java.util.Optional;

public interface OrderPersistencePort {
    Order save(Order order);
    Optional<Order> findById(Long id);
    void deleteById(Long id);
    PageResult<Order> findAll(String search, PageQuery pageQuery);
    PageResult<Order> findByShipperId(String shipperId, PageQuery pageQuery);
}
