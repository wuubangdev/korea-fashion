package com.shope.kf.infrastructure.api;

import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.infrastructure.persistence.jpa.ReturnRequestJpaEntity;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequireAuth
@RequestMapping("/api/return-requests")
public class ReturnRequestController extends CrudController<ReturnRequestJpaEntity, String> {
    public ReturnRequestController(GenericCrudUseCase<ReturnRequestJpaEntity, String> useCase) {
        super(useCase);
    }

    @Override
    protected String parseId(String id) {
        return id;
    }
}
