package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "audit_logs",
        indexes = {
                @Index(name = "idx_audit_logs_actor", columnList = "actor_id"),
                @Index(name = "idx_audit_logs_resource", columnList = "resource_type,resource_id"),
                @Index(name = "idx_audit_logs_action_time", columnList = "action,created_time")
        }
)
@Data
public class AuditLogJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 120)
    private String actorId;

    @Column(length = 120)
    private String actorName;

    @Column(length = 60)
    private String actorRole;

    @Column(length = 80)
    private String action;

    @Column(length = 80)
    private String resourceType;

    @Column(length = 120)
    private String resourceId;

    @Column(length = 60)
    private String requestMethod;

    @Column(length = 500)
    private String requestPath;

    @Column(length = 80)
    private String ipAddress;

    @Column(length = 300)
    private String userAgent;

    @Lob
    private String beforeData;

    @Lob
    private String afterData;

    @Column(length = 40)
    private String result;

    @Column(length = 500)
    private String message;

    @Column(name = "created_time")
    private LocalDateTime createdTime;
}
