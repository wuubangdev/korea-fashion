package com.shope.kf.infrastructure.api;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.infrastructure.persistence.jpa.ContactMessageJpaEntity;
import com.shope.kf.infrastructure.security.RequireAuth;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact-messages")
public class ContactMessageController extends CrudController<ContactMessageJpaEntity, Long> {
    public ContactMessageController(GenericCrudUseCase<ContactMessageJpaEntity, Long> useCase) {
        super(useCase);
    }

    @Override
    @PostMapping
    public ResponseEntity<ContactMessageJpaEntity> create(@Valid @RequestBody ContactMessageJpaEntity body) {
        body.setId(null);
        body.setStatus(defaultValue(body.getStatus(), "NEW"));
        body.setSource(defaultValue(body.getSource(), "CONTACT_PAGE"));
        body.setAdminNote(null);
        return super.create(body);
    }

    @Override
    @RequireAuth
    @GetMapping
    public ResponseEntity<PageResult<ContactMessageJpaEntity>> list(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        return super.list(search, page, size, sort);
    }

    @Override
    @RequireAuth
    @GetMapping("/trash")
    public ResponseEntity<PageResult<ContactMessageJpaEntity>> trash(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "deletedAt,desc") String sort
    ) {
        return super.trash(search, page, size, sort);
    }

    @Override
    @RequireAuth
    @GetMapping("/{id}")
    public ResponseEntity<ContactMessageJpaEntity> get(@PathVariable String id) {
        return super.get(id);
    }

    @Override
    @RequireAuth
    @PutMapping("/{id}")
    public ResponseEntity<ContactMessageJpaEntity> update(@PathVariable String id, @Valid @RequestBody ContactMessageJpaEntity body) {
        return super.update(id, body);
    }

    @Override
    @RequireAuth
    @DeleteMapping("/{id}")
    public ResponseEntity<com.shope.kf.infrastructure.api.dto.response.ApiResponse<Void>> delete(@PathVariable String id) {
        return super.delete(id);
    }

    @Override
    protected Long parseId(String id) {
        return Long.parseLong(id);
    }

    private String defaultValue(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }
}
