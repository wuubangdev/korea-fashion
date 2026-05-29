package com.shope.kf.infrastructure.persistence.adapter;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.domain.model.Category;
import com.shope.kf.infrastructure.persistence.jpa.CategoryJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.CategoryJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class CategoryPersistenceAdapterTest {

    private CategoryJpaRepository categoryJpaRepository;
    private CategoryPersistenceAdapter adapter;

    @BeforeEach
    void setUp() {
        categoryJpaRepository = Mockito.mock(CategoryJpaRepository.class);
        adapter = new CategoryPersistenceAdapter(categoryJpaRepository, Mockito.mock(TrashQuerySupport.class));
        when(categoryJpaRepository.save(any(CategoryJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void save_existingCategoryCopiesVersionAndAuditFields() {
        Instant createdAt = Instant.parse("2026-05-01T10:15:30Z");
        CategoryJpaEntity existing = new CategoryJpaEntity();
        existing.setId(7L);
        existing.setVersion(3L);
        existing.setCreatedAt(createdAt);
        existing.setCreatedBy("creator");
        when(categoryJpaRepository.findById(7L)).thenReturn(Optional.of(existing));

        Category category = Category.builder()
                .id(7L)
                .code("tops")
                .name("Tops")
                .slug("tops")
                .build();

        adapter.save(category);

        ArgumentCaptor<CategoryJpaEntity> savedCaptor = ArgumentCaptor.forClass(CategoryJpaEntity.class);
        verify(categoryJpaRepository).save(savedCaptor.capture());

        CategoryJpaEntity saved = savedCaptor.getValue();
        assertEquals(3L, saved.getVersion());
        assertEquals(createdAt, saved.getCreatedAt());
        assertEquals("creator", saved.getCreatedBy());
        assertEquals("tops", saved.getCode());
    }

    @Test
    void deleteAllById_marksAllFoundCategoriesDeletedAndSavesOnce() {
        CategoryJpaEntity first = new CategoryJpaEntity();
        first.setId(1L);
        CategoryJpaEntity second = new CategoryJpaEntity();
        second.setId(2L);
        when(categoryJpaRepository.findAllById(List.of(1L, 2L))).thenReturn(List.of(first, second));

        adapter.deleteAllById(List.of(1L, 2L));

        verify(categoryJpaRepository).saveAll(List.of(first, second));
        assertNotNull(first.getDeletedAt());
        assertNotNull(second.getDeletedAt());
        assertEquals("system", first.getDeletedBy());
        assertEquals("system", second.getDeletedBy());
    }

    @Test
    void deleteAllById_withEmptyIdsDoesNothing() {
        adapter.deleteAllById(List.of());

        verify(categoryJpaRepository, never()).findAllById(any());
        verify(categoryJpaRepository, never()).saveAll(any());
    }

    @Test
    void findAll_withSearchTrimsKeywordAndUsesKeywordSearch() {
        CategoryJpaEntity category = new CategoryJpaEntity();
        category.setId(1L);
        category.setName("Tops");
        when(categoryJpaRepository.searchByKeyword(eq("tops"), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(category)));

        var result = adapter.findAll("  tops  ", PageQuery.of(0, 10, "id,desc"));

        assertEquals(1, result.content().size());
        assertEquals("Tops", result.content().getFirst().getName());
        verify(categoryJpaRepository).searchByKeyword(eq("tops"), any(Pageable.class));
    }
}
