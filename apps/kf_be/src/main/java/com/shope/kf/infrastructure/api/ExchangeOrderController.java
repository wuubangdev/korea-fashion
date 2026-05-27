package com.shope.kf.infrastructure.api;

import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.infrastructure.persistence.jpa.ExchangeOrderJpaEntity;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequireAuth
@RequestMapping("/api/exchange-orders")
public class ExchangeOrderController extends CrudController<ExchangeOrderJpaEntity, String> {
    public ExchangeOrderController(GenericCrudUseCase<ExchangeOrderJpaEntity, String> useCase) {
        super(useCase);
    }

    @Override
    protected String parseId(String id) {
        return id;
    }
}
