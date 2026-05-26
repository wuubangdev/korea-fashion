package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.persistence.jpa.ReviewJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.ReviewJpaRepository;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequireAuth
@RestController
@RequestMapping("/api/reviews")
public class ReviewController extends CrudController<ReviewJpaEntity, String, ReviewJpaRepository> {
    public ReviewController(ReviewJpaRepository repository) {
        super(repository);
    }

    @Override
    protected String parseId(String id) {
        return id;
    }
}
