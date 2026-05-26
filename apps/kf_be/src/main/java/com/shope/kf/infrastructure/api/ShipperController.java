package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.persistence.jpa.ShipperJpaEntity;
import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequireAuth
@RestController
@RequestMapping("/api/shippers")
public class ShipperController extends CrudController<ShipperJpaEntity, String> {
    public ShipperController(@Qualifier("shipperCrudUseCase") GenericCrudUseCase<ShipperJpaEntity, String> useCase) {
        super(useCase);
    }

    @Override
    protected String parseId(String id) {
        return id;
    }
}
