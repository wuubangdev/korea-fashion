package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.SiteSettingJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface SiteSettingJpaRepository extends JpaRepository<SiteSettingJpaEntity, String>, JpaSpecificationExecutor<SiteSettingJpaEntity> {
}
