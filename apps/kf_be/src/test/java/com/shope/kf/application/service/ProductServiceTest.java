package com.shope.kf.application.service;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.port.out.ProductPersistencePort;
import com.shope.kf.domain.model.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

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
        PageQuery query = PageQuery.of(0, 10, "id,desc");
        when(port.findAll((String) null, query)).thenReturn(new PageResult<>(List.of(p), 0, 10, 1, 1));

        PageResult<Product> page = service.list((String) null, query);
        assertEquals(1, page.totalElements());
        assertEquals("A", page.content().get(0).getName());
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
