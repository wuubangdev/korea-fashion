package com.shope.kf.infrastructure.persistence.repository;

import com.shope.kf.infrastructure.persistence.jpa.MediaAssetJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MediaAssetJpaRepository extends JpaRepository<MediaAssetJpaEntity, Long>, JpaSpecificationExecutor<MediaAssetJpaEntity> {
    Page<MediaAssetJpaEntity> findByFolderContainingIgnoreCaseOrNameContainingIgnoreCaseOrOriginalFilenameContainingIgnoreCase(
            String folder,
            String name,
            String originalFilename,
            Pageable pageable
    );

    Page<MediaAssetJpaEntity> findByFolder(String folder, Pageable pageable);

    @Query("select distinct m.folder from MediaAssetJpaEntity m order by m.folder asc")
    List<String> findDistinctFolders();
}
