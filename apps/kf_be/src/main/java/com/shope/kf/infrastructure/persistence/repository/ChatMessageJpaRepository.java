package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.ChatMessageJpaEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface ChatMessageJpaRepository extends JpaRepository<ChatMessageJpaEntity, Long> {
    List<ChatMessageJpaEntity> findBySessionIdAndDeletedAtIsNullOrderByCreatedAtAsc(Long sessionId);
    List<ChatMessageJpaEntity> findBySessionIdAndDeletedAtIsNullOrderByCreatedAtDesc(Long sessionId, Pageable pageable);

    @Query("""
            select count(m)
            from ChatMessageJpaEntity m
            join m.session s
            where m.role = 'user'
              and m.createdAt >= :since
              and m.deletedAt is null
              and s.deletedAt is null
              and s.user.username = :username
            """)
    long countUserMessagesSince(@Param("username") String username, @Param("since") Instant since);

    @Query("""
            select count(m)
            from ChatMessageJpaEntity m
            join m.session s
            where m.role = 'user'
              and m.createdAt >= :since
              and m.deletedAt is null
              and s.deletedAt is null
              and s.clientSessionId = :clientSessionId
            """)
    long countGuestMessagesSince(@Param("clientSessionId") String clientSessionId, @Param("since") Instant since);
}
