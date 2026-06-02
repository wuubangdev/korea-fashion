package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.api.dto.request.CreateOrderRequest;
import com.shope.kf.infrastructure.api.dto.request.AssignShipperRequest;
import com.shope.kf.infrastructure.api.dto.request.UpdatePaymentStatusRequest;
import com.shope.kf.infrastructure.api.dto.request.UpdateShippingStatusRequest;
import com.shope.kf.infrastructure.api.dto.response.ApiResponse;
import com.shope.kf.infrastructure.api.dto.response.OrderResponse;
import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.in.OrderUseCase;
import com.shope.kf.domain.model.Order;
import com.shope.kf.domain.model.PaymentStatus;
import com.shope.kf.infrastructure.api.mapper.OrderApiMapper;
import com.shope.kf.infrastructure.persistence.jpa.PaymentJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.PaymentJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.UserJpaRepository;
import com.shope.kf.infrastructure.security.RoleConstants;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderUseCase orderUseCase;
    private final PaymentJpaRepository paymentRepository;
    private final UserJpaRepository userRepository;

    public OrderController(OrderUseCase orderUseCase, PaymentJpaRepository paymentRepository, UserJpaRepository userRepository) {
        this.orderUseCase = orderUseCase;
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> create(Authentication authentication, @jakarta.validation.Valid @RequestBody CreateOrderRequest req) {
        Order order = OrderApiMapper.toDomain(req);
        attachCurrentUser(order, authentication);
        Order saved = orderUseCase.create(order);
        createInitialPayment(saved);
        return ResponseEntity.ok(OrderApiMapper.toResponse(saved));
    }

    private void createInitialPayment(Order order) {
        PaymentJpaEntity payment = new PaymentJpaEntity();
        payment.setId(generatePaymentId());
        payment.setOrderId(order.getId());
        payment.setAmount(firstNonNull(order.getGrandTotal(), order.getTotal(), BigDecimal.ZERO));
        payment.setMethod(order.getPaymentMethodId());
        payment.setStatus(PaymentStatus.PENDING.name());
        payment.setPaidAt(null);
        paymentRepository.save(payment);
    }

    private String generatePaymentId() {
        String id;
        do {
            id = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        } while (paymentRepository.existsById(id));
        return id;
    }

    private BigDecimal firstNonNull(BigDecimal... values) {
        for (BigDecimal value : values) {
            if (value != null) {
                return value;
            }
        }
        return BigDecimal.ZERO;
    }

    private void attachCurrentUser(Order order, Authentication authentication) {
        order.setCustomerId(null);
        if (authentication == null || authentication.getName() == null) {
            return;
        }

        userRepository.findByUsername(authentication.getName()).ifPresent(user -> {
            order.setCustomerId(user.getId());
            order.setCustomerName(firstNonBlank(order.getCustomerName(), user.getFullName(), user.getUsername()));
            order.setCustomerPhone(firstNonBlank(order.getCustomerPhone(), user.getPhone()));
            order.setCustomerEmail(firstNonBlank(order.getCustomerEmail(), user.getEmail()));
        });
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value.trim();
            }
        }
        return null;
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
    @GetMapping("/trash")
    public ResponseEntity<PageResult<OrderResponse>> trash(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "deletedAt,desc") String sort
    ) {
        return ResponseEntity.ok(orderUseCase.trash(search, PageQuery.of(page, size, sort)).map(OrderApiMapper::toResponse));
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
    @PutMapping("/{id}/payment-status")
    public ResponseEntity<OrderResponse> updatePaymentStatus(@PathVariable Long id, @jakarta.validation.Valid @RequestBody UpdatePaymentStatusRequest req) {
        Order updated = orderUseCase.updatePaymentStatus(id, req.getPaymentStatus());
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

    @com.shope.kf.infrastructure.security.RequireAuth
    @PostMapping("/{id}/restore")
    public ResponseEntity<ApiResponse<Void>> restore(@PathVariable Long id) {
        orderUseCase.restore(id);
        return ResponseEntity.ok(ApiResponse.ok("Restored successfully", null));
    }

    @com.shope.kf.infrastructure.security.RequireAuth
    @PostMapping("/trash/restore/bulk")
    public ResponseEntity<ApiResponse<Void>> restoreAll(@RequestBody List<Long> ids) {
        orderUseCase.restoreAll(ids);
        return ResponseEntity.ok(ApiResponse.ok("Restored successfully", null));
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
