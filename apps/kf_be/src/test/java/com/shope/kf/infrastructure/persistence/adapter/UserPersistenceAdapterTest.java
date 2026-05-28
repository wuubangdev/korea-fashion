package com.shope.kf.infrastructure.persistence.adapter;

import com.shope.kf.domain.model.User;
import com.shope.kf.infrastructure.persistence.jpa.UserJpaEntity;
import com.shope.kf.infrastructure.persistence.repository.RoleJpaRepository;
import com.shope.kf.infrastructure.persistence.repository.UserJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class UserPersistenceAdapterTest {

    private UserJpaRepository userJpaRepository;
    private UserPersistenceAdapter adapter;

    @BeforeEach
    void setUp() {
        userJpaRepository = Mockito.mock(UserJpaRepository.class);
        RoleJpaRepository roleJpaRepository = Mockito.mock(RoleJpaRepository.class);
        adapter = new UserPersistenceAdapter(userJpaRepository, roleJpaRepository);
        when(userJpaRepository.save(any(UserJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void save_newUser_doesNotCopyVersionOrAudit() {
        User user = User.builder()
                .username("new-user")
                .password("secret")
                .email("new@example.com")
                .build();

        adapter.save(user);

        ArgumentCaptor<UserJpaEntity> savedCaptor = ArgumentCaptor.forClass(UserJpaEntity.class);
        verify(userJpaRepository, never()).findById(any());
        verify(userJpaRepository).save(savedCaptor.capture());

        UserJpaEntity saved = savedCaptor.getValue();
        assertNull(saved.getVersion());
        assertNull(saved.getCreatedAt());
        assertNull(saved.getUpdatedAt());
        assertNull(saved.getCreatedBy());
        assertNull(saved.getUpdatedBy());
        assertNull(saved.getDeletedAt());
        assertNull(saved.getDeletedBy());
    }

    @Test
    void save_existingUserCopiesVersionAndAllAuditFields() {
        Instant createdAt = Instant.parse("2026-05-01T10:15:30Z");
        Instant updatedAt = Instant.parse("2026-05-02T10:15:30Z");
        Instant deletedAt = Instant.parse("2026-05-03T10:15:30Z");
        UserJpaEntity existing = new UserJpaEntity();
        existing.setId(7L);
        existing.setVersion(3L);
        existing.setCreatedAt(createdAt);
        existing.setUpdatedAt(updatedAt);
        existing.setCreatedBy("creator");
        existing.setUpdatedBy("updater");
        existing.setDeletedAt(deletedAt);
        existing.setDeletedBy("deleter");
        when(userJpaRepository.findById(7L)).thenReturn(Optional.of(existing));

        User user = User.builder()
                .id(7L)
                .username("changed-user")
                .password("changed-secret")
                .email("changed@example.com")
                .build();

        adapter.save(user);

        ArgumentCaptor<UserJpaEntity> savedCaptor = ArgumentCaptor.forClass(UserJpaEntity.class);
        verify(userJpaRepository).save(savedCaptor.capture());

        UserJpaEntity saved = savedCaptor.getValue();
        assertEquals(3L, saved.getVersion());
        assertEquals(createdAt, saved.getCreatedAt());
        assertEquals(updatedAt, saved.getUpdatedAt());
        assertEquals("creator", saved.getCreatedBy());
        assertEquals("updater", saved.getUpdatedBy());
        assertEquals(deletedAt, saved.getDeletedAt());
        assertEquals("deleter", saved.getDeletedBy());
        assertEquals("changed-user", saved.getUsername());
        assertEquals("changed-secret", saved.getPassword());
        assertEquals("changed@example.com", saved.getEmail());
    }

    @Test
    void save_userWithUnknownIdDoesNotInventVersionOrAudit() {
        when(userJpaRepository.findById(99L)).thenReturn(Optional.empty());

        User user = User.builder()
                .id(99L)
                .username("missing-user")
                .password("secret")
                .email("missing@example.com")
                .build();

        adapter.save(user);

        ArgumentCaptor<UserJpaEntity> savedCaptor = ArgumentCaptor.forClass(UserJpaEntity.class);
        verify(userJpaRepository).save(savedCaptor.capture());

        UserJpaEntity saved = savedCaptor.getValue();
        assertEquals(99L, saved.getId());
        assertNull(saved.getVersion());
        assertNull(saved.getCreatedAt());
        assertNull(saved.getUpdatedAt());
        assertNull(saved.getCreatedBy());
        assertNull(saved.getUpdatedBy());
        assertNull(saved.getDeletedAt());
        assertNull(saved.getDeletedBy());
    }
}
