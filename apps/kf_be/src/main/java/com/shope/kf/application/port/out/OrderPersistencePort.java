package com.shope.kf.application.port.out;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.domain.model.Order;

import java.util.List;
import java.util.Optional;

public interface OrderPersistencePort {
    Order save(Order order);
    Optional<Order> findById(Long id);
    void deleteById(Long id);
    void deleteAllById(List<Long> ids);
    void restoreById(Long id);
    void restoreAllById(List<Long> ids);
    void hardDeleteById(Long id);
    void hardDeleteAllById(List<Long> ids);
    PageResult<Order> findAll(String search, PageQuery pageQuery);
    PageResult<Order> findDeleted(String search, PageQuery pageQuery);
    PageResult<Order> findByShipperId(String shipperId, PageQuery pageQuery);
}
