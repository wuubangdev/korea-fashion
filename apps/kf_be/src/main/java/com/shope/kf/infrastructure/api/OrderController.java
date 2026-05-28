package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.api.dto.request.CreateOrderRequest;
import com.shope.kf.infrastructure.api.dto.request.AssignShipperRequest;
import com.shope.kf.infrastructure.api.dto.request.UpdateShippingStatusRequest;
import com.shope.kf.infrastructure.api.dto.response.ApiResponse;
import com.shope.kf.infrastructure.api.dto.response.OrderResponse;
import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.in.OrderUseCase;
import com.shope.kf.domain.model.Order;
import com.shope.kf.infrastructure.api.mapper.OrderApiMapper;
import com.shope.kf.infrastructure.security.RoleConstants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderUseCase orderUseCase;

    public OrderController(OrderUseCase orderUseCase) {
        this.orderUseCase = orderUseCase;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> create(@jakarta.validation.Valid @RequestBody CreateOrderRequest req) {
        Order saved = orderUseCase.create(OrderApiMapper.toDomain(req));
        return ResponseEntity.ok(OrderApiMapper.toResponse(saved));
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @PostMapping("/{id}/copy")
    public ResponseEntity<OrderResponse> copy(@PathVariable Long id) {
        Order copied = orderUseCase.copy(id);
        return ResponseEntity.ok(OrderApiMapper.toResponse(copied));
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @GetMapping
    public ResponseEntity<PageResult<OrderResponse>> list(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        return ResponseEntity.ok(orderUseCase.list(search, PageQuery.of(page, size, sort)).map(OrderApiMapper::toResponse));
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> get(@PathVariable Long id) {
        Order o = orderUseCase.findById(id);
        return ResponseEntity.ok(OrderApiMapper.toResponse(o));
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @GetMapping("/shipper/{shipperId}")
    public ResponseEntity<PageResult<OrderResponse>> listByShipper(
            @PathVariable String shipperId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        return ResponseEntity.ok(orderUseCase.listByShipper(shipperId, PageQuery.of(page, size, sort)).map(OrderApiMapper::toResponse));
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateStatus(@PathVariable Long id, @RequestParam String status) {
        Order updated = orderUseCase.updateStatus(id, status);
        return ResponseEntity.ok(OrderApiMapper.toResponse(updated));
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @PutMapping("/{id}/shipper")
    public ResponseEntity<OrderResponse> assignShipper(@PathVariable Long id, @jakarta.validation.Valid @RequestBody AssignShipperRequest req) {
        Order updated = orderUseCase.assignShipper(id, req.getShipperId());
        return ResponseEntity.ok(OrderApiMapper.toResponse(updated));
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @PutMapping("/{id}/shipping-status")
    public ResponseEntity<OrderResponse> updateShippingStatus(@PathVariable Long id, @jakarta.validation.Valid @RequestBody UpdateShippingStatusRequest req) {
        Order updated = orderUseCase.updateShippingStatus(id, req.getShippingStatus());
        return ResponseEntity.ok(OrderApiMapper.toResponse(updated));
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        orderUseCase.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Deleted successfully", null));
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @DeleteMapping("/bulk")
    public ResponseEntity<ApiResponse<Void>> deleteAll(@RequestBody List<Long> ids) {
        orderUseCase.deleteAll(ids);
        return ResponseEntity.ok(ApiResponse.ok("Deleted successfully", null));
    }

    @com.shope.kf.infrastructure.security.RequireAuth(roles = {RoleConstants.ADMIN})
    @DeleteMapping("/{id}/hard")
    public ResponseEntity<ApiResponse<Void>> hardDelete(@PathVariable Long id) {
        orderUseCase.hardDelete(id);
        return ResponseEntity.ok(ApiResponse.ok("Hard deleted successfully", null));
    }

    @com.shope.kf.infrastructure.security.RequireAuth(roles = {RoleConstants.ADMIN})
    @DeleteMapping("/hard/bulk")
    public ResponseEntity<ApiResponse<Void>> hardDeleteAll(@RequestBody List<Long> ids) {
        orderUseCase.hardDeleteAll(ids);
        return ResponseEntity.ok(ApiResponse.ok("Hard deleted successfully", null));
    }

}
