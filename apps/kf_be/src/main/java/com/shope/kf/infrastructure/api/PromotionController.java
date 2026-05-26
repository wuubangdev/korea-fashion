package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.persistence.jpa.PromotionJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.PromotionJpaRepository;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequireAuth
@RestController
@RequestMapping("/api/promotions")
public class PromotionController extends CrudController<PromotionJpaEntity, String, PromotionJpaRepository> {
    public PromotionController(PromotionJpaRepository repository) {
        super(repository);
    }

    @Override
    protected String parseId(String id) {
        return id;
    }
}
