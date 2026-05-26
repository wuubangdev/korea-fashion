package com.shope.kf.application.service;

import com.shope.kf.application.port.out.ProductPersistencePort;
import com.shope.kf.domain.model.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class ProductServiceTest {

    private ProductPersistencePort port;
    private ProductService service;

    @BeforeEach
    void setUp() {
        port = Mockito.mock(ProductPersistencePort.class);
        service = new ProductService(port);
    }

    @Test
    void list_returnsPage() {
        Product p = Product.builder().id(1L).name("A").price(BigDecimal.ZERO).build();
        when(port.findAll(null, PageRequest.of(0,10))).thenReturn(new PageImpl<>(List.of(p)));

        Page<Product> page = service.list(null, PageRequest.of(0,10));
        assertEquals(1, page.getTotalElements());
        assertEquals("A", page.getContent().get(0).getName());
    }

    @Test
    void create_and_findById() {
        Product p = Product.builder().name("New").build();
        when(port.save(p)).thenReturn(Product.builder().id(2L).name("New").build());
        when(port.findById(2L)).thenReturn(Optional.of(Product.builder().id(2L).name("New").build()));

        Product saved = service.create(p);
        assertEquals(2L, saved.getId());
        Product found = service.findById(2L);
        assertEquals("New", found.getName());
    }
}
