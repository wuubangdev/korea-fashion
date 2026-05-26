package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.persistence.jpa.PaymentJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.PaymentJpaRepository;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequireAuth
@RestController
@RequestMapping("/api/payments")
public class PaymentController extends CrudController<PaymentJpaEntity, String, PaymentJpaRepository> {
    public PaymentController(PaymentJpaRepository repository) {
        super(repository);
    }

    @Override
    protected String parseId(String id) {
        return id;
    }
}
