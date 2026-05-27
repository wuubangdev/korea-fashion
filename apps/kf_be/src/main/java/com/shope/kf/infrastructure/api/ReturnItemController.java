package com.shope.kf.infrastructure.api;

import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.infrastructure.persistence.jpa.ReturnItemJpaEntity;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequireAuth
@RequestMapping("/api/return-items")
public class ReturnItemController extends CrudController<ReturnItemJpaEntity, Long> {
    public ReturnItemController(GenericCrudUseCase<ReturnItemJpaEntity, Long> useCase) {
        super(useCase);
    }

    @Override
    protected Long parseId(String id) {
        return Long.parseLong(id);
    }
}
