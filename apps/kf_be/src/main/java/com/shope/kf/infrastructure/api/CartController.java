package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.persistence.jpa.CartJpaEntity;
import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequireAuth
@RestController
@RequestMapping("/api/carts")
public class CartController extends CrudController<CartJpaEntity, String> {
    public CartController(@Qualifier("cartCrudUseCase") GenericCrudUseCase<CartJpaEntity, String> useCase) {
        super(useCase);
    }

    @Override
    protected String parseId(String id) {
        return id;
    }
}
