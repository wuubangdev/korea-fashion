package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.persistence.jpa.CartItemJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.CartItemJpaRepository;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequireAuth
@RestController
@RequestMapping("/api/cart-items")
public class CartItemController extends CrudController<CartItemJpaEntity, Long, CartItemJpaRepository> {
    public CartItemController(CartItemJpaRepository repository) {
        super(repository);
    }

    @Override
    protected Long parseId(String id) {
        return Long.valueOf(id);
    }
}
