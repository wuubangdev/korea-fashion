package com.shope.kf.infrastructure.api;

import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.infrastructure.exception.AppException;
import com.shope.kf.infrastructure.exception.ErrorCode;
import com.shope.kf.infrastructure.persistence.jpa.SiteSettingJpaEntity;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequireAuth
@RequestMapping("/api/site-settings")
public class SiteSettingController extends CrudController<SiteSettingJpaEntity, String> {
    private final GenericCrudUseCase<SiteSettingJpaEntity, String> useCase;

    public SiteSettingController(GenericCrudUseCase<SiteSettingJpaEntity, String> useCase) {
        super(useCase);
        this.useCase = useCase;
    }

    @GetMapping("/current")
    public ResponseEntity<SiteSettingJpaEntity> current() {
        return useCase.findById("default")
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Site settings not found"));
    }

    @Override
    protected String parseId(String id) {
        return id;
    }
}
