package com.shope.kf.infrastructure.api;

import com.shope.kf.application.dto.request.CreateOrderRequest;
import com.shope.kf.application.dto.request.AssignShipperRequest;
import com.shope.kf.application.dto.request.UpdateShippingStatusRequest;
import com.shope.kf.application.dto.response.OrderResponse;
import com.shope.kf.application.port.in.OrderUseCase;
import com.shope.kf.domain.model.Order;
import com.shope.kf.infrastructure.api.mapper.OrderApiMapper;
import com.shope.kf.infrastructure.security.RequireAuth;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RequireAuth
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

    @GetMapping
    public ResponseEntity<Page<OrderResponse>> list(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        String[] sortParts = sort.split(",");
        Sort.Direction dir = Sort.Direction.fromString(sortParts.length > 1 ? sortParts[1] : "desc");
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sortParts[0]));
        Page<Order> p = orderUseCase.list(search, pageable);
        List<OrderResponse> items = p.stream().map(OrderApiMapper::toResponse).collect(Collectors.toList());
        Page<OrderResponse> resp = new PageImpl<>(items, pageable, p.getTotalElements());
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> get(@PathVariable Long id) {
        Order o = orderUseCase.findById(id);
        return ResponseEntity.ok(OrderApiMapper.toResponse(o));
    }

    @GetMapping("/shipper/{shipperId}")
    public ResponseEntity<Page<OrderResponse>> listByShipper(
            @PathVariable String shipperId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        String[] sortParts = sort.split(",");
        Sort.Direction dir = Sort.Direction.fromString(sortParts.length > 1 ? sortParts[1] : "desc");
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sortParts[0]));
        Page<Order> orders = orderUseCase.listByShipper(shipperId, pageable);
        List<OrderResponse> items = orders.stream().map(OrderApiMapper::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(new PageImpl<>(items, pageable, orders.getTotalElements()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateStatus(@PathVariable Long id, @RequestParam String status) {
        Order updated = orderUseCase.updateStatus(id, status);
        return ResponseEntity.ok(OrderApiMapper.toResponse(updated));
    }

    @PutMapping("/{id}/shipper")
    public ResponseEntity<OrderResponse> assignShipper(@PathVariable Long id, @jakarta.validation.Valid @RequestBody AssignShipperRequest req) {
        Order updated = orderUseCase.assignShipper(id, req.getShipperId());
        return ResponseEntity.ok(OrderApiMapper.toResponse(updated));
    }

    @PutMapping("/{id}/shipping-status")
    public ResponseEntity<OrderResponse> updateShippingStatus(@PathVariable Long id, @jakarta.validation.Valid @RequestBody UpdateShippingStatusRequest req) {
        Order updated = orderUseCase.updateShippingStatus(id, req.getShippingStatus());
        return ResponseEntity.ok(OrderApiMapper.toResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        orderUseCase.delete(id);
        return ResponseEntity.noContent().build();
    }

}
