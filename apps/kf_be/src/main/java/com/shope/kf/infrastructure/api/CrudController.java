package com.shope.kf.infrastructure.api;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.in.GenericCrudUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

public abstract class CrudController<T, ID> {
    private final GenericCrudUseCase<T, ID> useCase;

    protected CrudController(GenericCrudUseCase<T, ID> useCase) {
        this.useCase = useCase;
    }

    @PostMapping
    public ResponseEntity<T> create(@RequestBody T body) {
        return ResponseEntity.ok(useCase.create(body));
    }

    @GetMapping
    public ResponseEntity<PageResult<T>> list(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        return ResponseEntity.ok(useCase.list(search, PageQuery.of(page, size, sort)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<T> get(@PathVariable String id) {
        return useCase.findById(parseId(id))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<T> update(@PathVariable String id, @RequestBody T body) {
        ID parsedId = parseId(id);
        return useCase.update(parsedId, body)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!useCase.delete(parseId(id))) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    protected abstract ID parseId(String id);
}
