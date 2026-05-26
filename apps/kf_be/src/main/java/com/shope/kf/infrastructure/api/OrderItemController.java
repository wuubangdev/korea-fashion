package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.persistence.jpa.OrderItemJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.OrderItemJpaRepository;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequireAuth
@RestController
@RequestMapping("/api/order-items")
public class OrderItemController extends CrudController<OrderItemJpaEntity, Long, OrderItemJpaRepository> {
    public OrderItemController(OrderItemJpaRepository repository) {
        super(repository);
    }

    @Override
    protected Long parseId(String id) {
        return Long.valueOf(id);
    }
}
