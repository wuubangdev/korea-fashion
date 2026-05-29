package com.shope.kf.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(
        name = "media_assets",
        indexes = {
                @Index(name = "idx_media_assets_folder", columnList = "folder"),
                @Index(name = "idx_media_assets_media_type", columnList = "media_type")
        }
)
@Data
@EqualsAndHashCode(callSuper = false)
public class MediaAssetJpaEntity extends BaseJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 120)
    private String folder;

    @Column(length = 180)
    private String name;

    @Column(length = 255)
    private String originalFilename;

    @Column(length = 500)
    private String url;

    @Column(length = 500)
    private String storagePath;

    @Column(length = 120)
    private String contentType;

    @Column(name = "media_type", length = 20)
    private String mediaType;

    private Long sizeBytes;

    @Column(name = "external_asset")
    private Boolean external;
}
