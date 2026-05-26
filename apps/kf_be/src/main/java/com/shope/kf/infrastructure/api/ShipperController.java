package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.persistence.jpa.ShipperJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.ShipperJpaRepository;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequireAuth
@RestController
@RequestMapping("/api/shippers")
public class ShipperController extends CrudController<ShipperJpaEntity, String, ShipperJpaRepository> {
    public ShipperController(ShipperJpaRepository repository) {
        super(repository);
    }

    @Override
    protected String parseId(String id) {
        return id;
    }
}
