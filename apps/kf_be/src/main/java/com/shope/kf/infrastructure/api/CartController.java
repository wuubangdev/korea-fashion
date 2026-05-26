package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.persistence.jpa.CartJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.CartJpaRepository;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequireAuth
@RestController
@RequestMapping("/api/carts")
public class CartController extends CrudController<CartJpaEntity, String, CartJpaRepository> {
    public CartController(CartJpaRepository repository) {
        super(repository);
    }

    @Override
    protected String parseId(String id) {
        return id;
    }
}
