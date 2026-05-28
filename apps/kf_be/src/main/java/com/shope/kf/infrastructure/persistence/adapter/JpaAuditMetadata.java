package com.shope.kf.infrastructure.persistence.adapter;

import com.shope.kf.infrastructure.persistence.jpa.BaseJpaEntity;

final class JpaAuditMetadata {
    private JpaAuditMetadata() {
    }

    static void copyVersionAndAudit(BaseJpaEntity source, BaseJpaEntity target) {
        target.setVersion(source.getVersion());
        target.setCreatedAt(source.getCreatedAt());
        target.setUpdatedAt(source.getUpdatedAt());
        target.setCreatedBy(source.getCreatedBy());
        target.setUpdatedBy(source.getUpdatedBy());
        target.setDeletedAt(source.getDeletedAt());
        target.setDeletedBy(source.getDeletedBy());
    }
}
