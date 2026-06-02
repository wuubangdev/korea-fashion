package com.shope.kf.infrastructure.api;

import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.domain.model.PaymentStatus;
import com.shope.kf.infrastructure.exception.AppException;
import com.shope.kf.infrastructure.exception.ErrorCode;
import com.shope.kf.application.port.in.OrderUseCase;
import com.shope.kf.infrastructure.persistence.jpa.PaymentJpaEntity;
import com.shope.kf.infrastructure.security.RequireAuth;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;

@RequireAuth
@RestController
@RequestMapping("/api/payments")
public class PaymentController extends CrudController<PaymentJpaEntity, String> {
    private final OrderUseCase orderUseCase;
    private final GenericCrudUseCase<PaymentJpaEntity, String> useCase;

    public PaymentController(
            @Qualifier("paymentCrudUseCase") GenericCrudUseCase<PaymentJpaEntity, String> useCase,
            OrderUseCase orderUseCase
    ) {
        super(useCase);
        this.orderUseCase = orderUseCase;
        this.useCase = useCase;
    }

    @Override
    @Transactional
    @PutMapping("/{id}")
    public ResponseEntity<PaymentJpaEntity> update(@PathVariable String id, @Valid @RequestBody PaymentJpaEntity body) {
        if (PaymentStatus.PAID.name().equalsIgnoreCase(body.getStatus()) && body.getPaidAt() == null) {
            body.setPaidAt(OffsetDateTime.now());
        }
        PaymentJpaEntity updated = useCase.update(parseId(id), body)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Resource not found"));
        syncOrderPaymentStatus(updated);
        return ResponseEntity.ok(updated);
    }

    private void syncOrderPaymentStatus(PaymentJpaEntity payment) {
        if (payment.getOrderId() == null || payment.getStatus() == null || payment.getStatus().isBlank()) {
            return;
        }

        String normalizedStatus = PaymentStatus.parse(payment.getStatus()).name();
        orderUseCase.updatePaymentStatus(payment.getOrderId(), normalizedStatus);
    }

    @Override
    protected String parseId(String id) {
        return id;
    }
}
