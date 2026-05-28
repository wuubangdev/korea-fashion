package com.shope.kf.application.service;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.in.GenericCrudUseCase;
import com.shope.kf.domain.exception.InvalidDomainStateException;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class GenericCrudServiceTest {

    @Test
    void list_delegatesToWrappedUseCase() {
        GenericCrudUseCase<String, Long> delegate = mock(GenericCrudUseCase.class);
        PageQuery pageQuery = PageQuery.of(0, 10, "id,desc");
        PageResult<String> expected = new PageResult<>(List.of("value"), 0, 10, 1, 1);
        when(delegate.list("value", pageQuery)).thenReturn(expected);

        GenericCrudService<String, Long> service = new GenericCrudService<>(delegate);

        assertEquals(expected, service.list("value", pageQuery));
    }

    @Test
    void update_delegatesToWrappedUseCase() {
        GenericCrudUseCase<String, Long> delegate = mock(GenericCrudUseCase.class);
        when(delegate.update(1L, "updated")).thenReturn(Optional.of("updated"));

        GenericCrudService<String, Long> service = new GenericCrudService<>(delegate);

        assertEquals(Optional.of("updated"), service.update(1L, "updated"));
    }

    @Test
    void create_validatesAndNormalizesGenericStatusFields() {
        GenericCrudUseCase<StatusEntity, Long> delegate = mock(GenericCrudUseCase.class);
        StatusEntity body = new StatusEntity();
        body.status = "active";
        body.paymentStatus = "paid";
        when(delegate.create(body)).thenReturn(body);

        GenericCrudService<StatusEntity, Long> service = new GenericCrudService<>(delegate, new GenericStatusValidator<>());

        service.create(body);

        assertEquals("ACTIVE", body.status);
        assertEquals("PAID", body.paymentStatus);
        verify(delegate).create(body);
    }

    @Test
    void create_rejectsUnknownGenericStatus() {
        GenericCrudUseCase<StatusEntity, Long> delegate = mock(GenericCrudUseCase.class);
        StatusEntity body = new StatusEntity();
        body.status = "unknown";

        GenericCrudService<StatusEntity, Long> service = new GenericCrudService<>(delegate, new GenericStatusValidator<>());

        assertThrows(InvalidDomainStateException.class, () -> service.create(body));
    }

    static class StatusEntity {
        String status;
        String paymentStatus;
    }
}
