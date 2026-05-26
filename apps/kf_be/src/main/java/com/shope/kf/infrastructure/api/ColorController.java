package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.persistence.jpa.ColorJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.ColorJpaRepository;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequireAuth
@RestController
@RequestMapping("/api/colors")
public class ColorController extends CrudController<ColorJpaEntity, String, ColorJpaRepository> {
    public ColorController(ColorJpaRepository repository) {
        super(repository);
    }

    @Override
    protected String parseId(String id) {
        return id;
    }
}
