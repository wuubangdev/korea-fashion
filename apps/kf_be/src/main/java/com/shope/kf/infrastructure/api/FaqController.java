package com.shope.kf.infrastructure.api;

import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.infrastructure.persistence.jpa.FaqJpaEntity;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequireAuth
@RequestMapping("/api/faqs")
public class FaqController extends CrudController<FaqJpaEntity, Long> {
    public FaqController(GenericCrudUseCase<FaqJpaEntity, Long> useCase) {
        super(useCase);
    }

    @Override
    protected Long parseId(String id) {
        return Long.parseLong(id);
    }
}
