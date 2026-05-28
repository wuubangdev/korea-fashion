package com.shope.kf.application.port.in;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.domain.model.Order;

import java.util.List;

public interface OrderUseCase {
    Order create(Order order);
    Order copy(Long id);
    Order updateStatus(Long id, String status);
    Order assignShipper(Long id, String shipperId);
    Order updateShippingStatus(Long id, String shippingStatus);
    void delete(Long id);
    void deleteAll(List<Long> ids);
    void hardDelete(Long id);
    void hardDeleteAll(List<Long> ids);
    Order findById(Long id);
    PageResult<Order> list(String search, PageQuery pageQuery);
    PageResult<Order> listByShipper(String shipperId, PageQuery pageQuery);
}
