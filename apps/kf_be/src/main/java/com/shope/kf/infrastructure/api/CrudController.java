package com.shope.kf.infrastructure.api;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.infrastructure.exception.AppException;
import com.shope.kf.infrastructure.exception.ErrorCode;
import com.shope.kf.infrastructure.security.RequireAuth;
import com.shope.kf.infrastructure.security.RoleConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

public abstract class CrudController<T, ID> {
    private final GenericCrudUseCase<T, ID> useCase;

    protected CrudController(GenericCrudUseCase<T, ID> useCase) {
        this.useCase = useCase;
    }

    @Operation(
            summary = "Tạo mới resource",
            description = "Tạo một bản ghi mới cho domain tương ứng. Request body là JSON entity của resource.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tạo mới thành công"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu request không hợp lệ", content = @Content),
            @ApiResponse(responseCode = "401", description = "Thiếu hoặc sai JWT token", content = @Content),
            @ApiResponse(responseCode = "403", description = "Không đủ quyền", content = @Content)
    })
    @PostMapping
    public ResponseEntity<T> create(@Valid @RequestBody T body) {
        return ResponseEntity.ok(useCase.create(body));
    }

    @Operation(
            summary = "Danh sách resource",
            description = """
                    Lấy danh sách resource có phân trang.

                    Tham số:
                    - `search`: từ khóa tìm kiếm chung nếu adapter hỗ trợ.
                    - `page`: trang bắt đầu từ 0.
                    - `size`: số phần tử mỗi trang.
                    - `sort`: định dạng `field,direction`, ví dụ `id,desc`.
                    """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công"),
            @ApiResponse(responseCode = "400", description = "Tham số phân trang/sort không hợp lệ", content = @Content)
    })
    @GetMapping
    public ResponseEntity<PageResult<T>> list(
            @Parameter(description = "Từ khóa tìm kiếm chung", example = "dress")
            @RequestParam(required = false) String search,
            @Parameter(description = "Số trang, bắt đầu từ 0", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Số item mỗi trang", example = "10")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sắp xếp theo `field,direction`", example = "id,desc")
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        return ResponseEntity.ok(useCase.list(search, PageQuery.of(page, size, sort)));
    }

    @Operation(summary = "Chi tiết resource", description = "Lấy một resource theo ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tìm thấy resource"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy resource", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<T> get(@Parameter(description = "ID resource", example = "1") @PathVariable String id) {
        return useCase.findById(parseId(id))
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Resource not found"));
    }

    @Operation(
            summary = "Cập nhật resource",
            description = "Cập nhật toàn bộ resource theo ID. Request body là JSON entity mới.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cập nhật thành công"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu request không hợp lệ", content = @Content),
            @ApiResponse(responseCode = "401", description = "Thiếu hoặc sai JWT token", content = @Content),
            @ApiResponse(responseCode = "403", description = "Không đủ quyền", content = @Content),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy resource", content = @Content)
    })
    @PutMapping("/{id}")
    public ResponseEntity<T> update(@Parameter(description = "ID resource", example = "1") @PathVariable String id, @Valid @RequestBody T body) {
        ID parsedId = parseId(id);
        return useCase.update(parsedId, body)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Resource not found"));
    }

    @Operation(
            summary = "Soft delete resource",
            description = "Xóa mềm resource nếu entity hỗ trợ `BaseJpaEntity.deletedAt`; các entity khác sẽ dùng delete mặc định của adapter.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Xóa mềm thành công"),
            @ApiResponse(responseCode = "401", description = "Thiếu hoặc sai JWT token", content = @Content),
            @ApiResponse(responseCode = "403", description = "Không đủ quyền", content = @Content),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy resource", content = @Content)
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<com.shope.kf.infrastructure.api.dto.response.ApiResponse<Void>> delete(@Parameter(description = "ID resource", example = "1") @PathVariable String id) {
        if (!useCase.delete(parseId(id))) {
            throw new AppException(ErrorCode.NOT_FOUND, "Resource not found");
        }
        return ResponseEntity.ok(com.shope.kf.infrastructure.api.dto.response.ApiResponse.ok("Deleted successfully", null));
    }

    @Operation(
            summary = "Hard delete resource",
            description = "Xóa cứng resource khỏi database. Chỉ ADMIN được dùng endpoint này.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Xóa cứng thành công"),
            @ApiResponse(responseCode = "401", description = "Thiếu hoặc sai JWT token", content = @Content),
            @ApiResponse(responseCode = "403", description = "Chỉ ADMIN được phép hard delete", content = @Content),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy resource", content = @Content)
    })
    @RequireAuth(roles = {RoleConstants.ADMIN})
    @DeleteMapping("/{id}/hard")
    public ResponseEntity<com.shope.kf.infrastructure.api.dto.response.ApiResponse<Void>> hardDelete(@Parameter(description = "ID resource", example = "1") @PathVariable String id) {
        if (!useCase.hardDelete(parseId(id))) {
            throw new AppException(ErrorCode.NOT_FOUND, "Resource not found");
        }
        return ResponseEntity.ok(com.shope.kf.infrastructure.api.dto.response.ApiResponse.ok("Hard deleted successfully", null));
    }

    protected abstract ID parseId(String id);
}
