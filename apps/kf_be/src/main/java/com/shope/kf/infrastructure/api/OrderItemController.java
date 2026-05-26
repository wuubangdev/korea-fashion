package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.persistence.jpa.OrderItemJpaEntity;
import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequireAuth
@RestController
@RequestMapping("/api/order-items")
public class OrderItemController extends CrudController<OrderItemJpaEntity, Long> {
    public OrderItemController(@Qualifier("orderItemCrudUseCase") GenericCrudUseCase<OrderItemJpaEntity, Long> useCase) {
        super(useCase);
    }

    @Override
    protected Long parseId(String id) {
        return Long.valueOf(id);
    }
}
