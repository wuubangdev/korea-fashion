package com.shope.kf.infrastructure.api;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.infrastructure.api.dto.response.ApiResponse;
import com.shope.kf.infrastructure.exception.AppException;
import com.shope.kf.infrastructure.exception.ErrorCode;
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
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Resource not found"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<T> update(@PathVariable String id, @RequestBody T body) {
        ID parsedId = parseId(id);
        return useCase.update(parsedId, body)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Resource not found"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        if (!useCase.delete(parseId(id))) {
            throw new AppException(ErrorCode.NOT_FOUND, "Resource not found");
        }
        return ResponseEntity.ok(ApiResponse.ok("Deleted successfully", null));
    }

    @DeleteMapping("/{id}/hard")
    public ResponseEntity<ApiResponse<Void>> hardDelete(@PathVariable String id) {
        if (!useCase.hardDelete(parseId(id))) {
            throw new AppException(ErrorCode.NOT_FOUND, "Resource not found");
        }
        return ResponseEntity.ok(ApiResponse.ok("Hard deleted successfully", null));
    }

    protected abstract ID parseId(String id);
}
