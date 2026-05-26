package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.persistence.jpa.PaymentJpaEntity;
import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequireAuth
@RestController
@RequestMapping("/api/payments")
public class PaymentController extends CrudController<PaymentJpaEntity, String> {
    public PaymentController(@Qualifier("paymentCrudUseCase") GenericCrudUseCase<PaymentJpaEntity, String> useCase) {
        super(useCase);
    }

    @Override
    protected String parseId(String id) {
        return id;
    }
}
