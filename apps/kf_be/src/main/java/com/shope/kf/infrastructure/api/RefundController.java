package com.shope.kf.infrastructure.api;

import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.infrastructure.persistence.jpa.RefundJpaEntity;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequireAuth
@RequestMapping("/api/refunds")
public class RefundController extends CrudController<RefundJpaEntity, String> {
    public RefundController(GenericCrudUseCase<RefundJpaEntity, String> useCase) {
        super(useCase);
    }

    @Override
    protected String parseId(String id) {
        return id;
    }
}
