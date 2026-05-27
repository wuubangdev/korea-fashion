package com.shope.kf.infrastructure.api;

import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.infrastructure.persistence.jpa.ProductRelationJpaEntity;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequireAuth
@RequestMapping("/api/product-relations")
public class ProductRelationController extends CrudController<ProductRelationJpaEntity, Long> {
    public ProductRelationController(GenericCrudUseCase<ProductRelationJpaEntity, Long> useCase) {
        super(useCase);
    }

    @Override
    protected Long parseId(String id) {
        return Long.parseLong(id);
    }
}
