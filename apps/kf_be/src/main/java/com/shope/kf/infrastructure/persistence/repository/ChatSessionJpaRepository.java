package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.ChatSessionJpaEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatSessionJpaRepository extends JpaRepository<ChatSessionJpaEntity, Long> {
    List<ChatSessionJpaEntity> findByUserUsernameAndDeletedAtIsNullOrderByUpdatedAtDesc(String username, Pageable pageable);
    List<ChatSessionJpaEntity> findByClientSessionIdAndDeletedAtIsNullOrderByUpdatedAtDesc(String clientSessionId, Pageable pageable);
    Optional<ChatSessionJpaEntity> findByIdAndUserUsernameAndDeletedAtIsNull(Long id, String username);
    Optional<ChatSessionJpaEntity> findByIdAndClientSessionIdAndDeletedAtIsNull(Long id, String clientSessionId);
}
