package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "site_settings")
@Data
public class SiteSettingJpaEntity extends BaseJpaEntity {
    @Id
    @Column(length = 40)
    private String id;

    @Column(length = 120, nullable = false)
    private String siteName;

    @Column(length = 500)
    private String siteDescription;

    @Column(length = 500)
    private String mainLogoUrl;

    @Column(length = 500)
    private String footerLogoUrl;

    @Column(length = 20)
    private String primaryColor;

    @Column(length = 20)
    private String secondaryColor;

    @Column(length = 20)
    private String accentColor;

    @Column(length = 20)
    private String backgroundColor;

    @Column(length = 20)
    private String textColor;

    @Column(length = 160)
    private String seoTitle;

    @Column(length = 500)
    private String seoDescription;

    @Column(length = 500)
    private String seoKeywords;

    @Column(length = 500)
    private String seoThumbnailUrl;

    @Column(length = 500)
    private String canonicalUrl;

    @Column(length = 100)
    private String facebookUrl;

    @Column(length = 100)
    private String instagramUrl;

    @Column(length = 100)
    private String tiktokUrl;

    @Column(length = 100)
    private String youtubeUrl;

    @Column(length = 30)
    private String hotline;

    @Column(length = 100)
    private String email;

    @Column(length = 300)
    private String address;

    @Column(length = 1000)
    private String footerAbout;
}
