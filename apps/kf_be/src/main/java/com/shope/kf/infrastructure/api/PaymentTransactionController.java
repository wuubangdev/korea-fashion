package com.shope.kf.infrastructure.api;

import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.infrastructure.persistence.jpa.PaymentTransactionJpaEntity;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequireAuth
@RequestMapping("/api/payment-transactions")
public class PaymentTransactionController extends CrudController<PaymentTransactionJpaEntity, String> {
    public PaymentTransactionController(GenericCrudUseCase<PaymentTransactionJpaEntity, String> useCase) {
        super(useCase);
    }

    @Override
    protected String parseId(String id) {
        return id;
    }
}
