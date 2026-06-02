package com.shope.kf.infrastructure.api;

import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.application.port.in.OrderUseCase;
import com.shope.kf.domain.model.PaymentStatus;
import com.shope.kf.infrastructure.exception.AppException;
import com.shope.kf.infrastructure.exception.ErrorCode;
import com.shope.kf.infrastructure.persistence.jpa.PaymentJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.RefundJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.PaymentJpaRepository;
import com.shope.kf.infrastructure.security.RequireAuth;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequireAuth
@RequestMapping("/api/refunds")
public class RefundController extends CrudController<RefundJpaEntity, String> {
    private final GenericCrudUseCase<RefundJpaEntity, String> useCase;
    private final OrderUseCase orderUseCase;
    private final PaymentJpaRepository paymentRepository;

    public RefundController(
            GenericCrudUseCase<RefundJpaEntity, String> useCase,
            OrderUseCase orderUseCase,
            PaymentJpaRepository paymentRepository
    ) {
        super(useCase);
        this.useCase = useCase;
        this.orderUseCase = orderUseCase;
        this.paymentRepository = paymentRepository;
    }

    @Override
    @Transactional
    @PostMapping
    public ResponseEntity<RefundJpaEntity> create(@Valid @RequestBody RefundJpaEntity body) {
        RefundJpaEntity created = useCase.create(body);
        syncCompletedRefund(created);
        return ResponseEntity.ok(created);
    }

    @Override
    @Transactional
    @PutMapping("/{id}")
    public ResponseEntity<RefundJpaEntity> update(@PathVariable String id, @Valid @RequestBody RefundJpaEntity body) {
        RefundJpaEntity updated = useCase.update(parseId(id), body)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Resource not found"));
        syncCompletedRefund(updated);
        return ResponseEntity.ok(updated);
    }

    private void syncCompletedRefund(RefundJpaEntity refund) {
        if (refund.getOrderId() == null
                || refund.getOrderId().isBlank()
                || refund.getStatus() == null
                || !PaymentStatus.REFUNDED.name().equalsIgnoreCase(refund.getStatus())
                        && !"COMPLETED".equalsIgnoreCase(refund.getStatus())) {
            return;
        }

        Long orderId;
        try {
            orderId = Long.valueOf(refund.getOrderId());
        } catch (NumberFormatException ex) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Refund order id is invalid");
        }

        paymentRepository.findFirstByOrderIdOrderByUpdatedAtDescIdDesc(orderId).ifPresent(payment -> {
            payment.setStatus(PaymentStatus.REFUNDED.name());
            paymentRepository.save(payment);
        });
        orderUseCase.updatePaymentStatus(orderId, PaymentStatus.REFUNDED.name());
    }

    @Override
    protected String parseId(String id) {
        return id;
    }
}
