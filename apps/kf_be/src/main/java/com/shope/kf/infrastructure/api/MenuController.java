package com.shope.kf.infrastructure.api;

import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.infrastructure.persistence.jpa.MenuJpaEntity;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequireAuth
@RequestMapping("/api/menus")
public class MenuController extends CrudController<MenuJpaEntity, String> {
    public MenuController(GenericCrudUseCase<MenuJpaEntity, String> useCase) {
        super(useCase);
    }

    @Override
    protected String parseId(String id) {
        return id;
    }
}
