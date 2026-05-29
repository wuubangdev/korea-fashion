package com.shope.kf.infrastructure.api;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.infrastructure.exception.AppException;
import com.shope.kf.infrastructure.exception.ErrorCode;
import com.shope.kf.infrastructure.persistence.adapter.TrashQuerySupport;
import com.shope.kf.infrastructure.persistence.jpa.MediaAssetJpaEntity;
import com.shope.kf.infrastructure.persistence.jpa.mapper.PageMapper;
import com.shope.kf.infrastructure.persistence.repository.MediaAssetJpaRepository;
import com.shope.kf.infrastructure.security.RequireAuth;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Stream;

@RequireAuth
@RestController
@RequestMapping("/api/media")
public class MediaController {
    private final MediaAssetJpaRepository repository;
    private final TrashQuerySupport trashQuerySupport;
    private final Path storageDir;

    public MediaController(
            MediaAssetJpaRepository repository,
            TrashQuerySupport trashQuerySupport,
            @Value("${kf.media.storage-dir:uploads}") String storageDir
    ) {
        this.repository = repository;
        this.trashQuerySupport = trashQuerySupport;
        this.storageDir = Path.of(storageDir).toAbsolutePath().normalize();
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<PageResult<MediaAssetJpaEntity>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String folder,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        var pageable = PageMapper.toPageable(PageQuery.of(page, size, sort));
        var result = StringUtils.hasText(folder)
                ? repository.findByFolder(folder, pageable)
                : StringUtils.hasText(search)
                ? repository.findByFolderContainingIgnoreCaseOrNameContainingIgnoreCaseOrOriginalFilenameContainingIgnoreCase(search, search, search, pageable)
                : repository.findAll(pageable);
        return ResponseEntity.ok(PageMapper.toResult(result, item -> item));
    }

    @GetMapping("/trash")
    @Transactional(readOnly = true)
    public ResponseEntity<PageResult<MediaAssetJpaEntity>> trash(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        return ResponseEntity.ok(trashQuerySupport.listDeleted(MediaAssetJpaEntity.class, search, PageQuery.of(page, size, sort)));
    }

    @GetMapping("/folders")
    @Transactional(readOnly = true)
    public ResponseEntity<List<String>> folders() {
        return ResponseEntity.ok(listFolders());
    }

    @PostMapping("/folders")
    public ResponseEntity<String> createFolder(@Valid @RequestBody FolderRequest request) {
        String folder = sanitizeFolder(request.folder());
        Path targetFolder = storageDir.resolve(folder).normalize();
        if (!targetFolder.startsWith(storageDir)) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Invalid folder");
        }

        try {
            Files.createDirectories(targetFolder);
        } catch (IOException ex) {
            throw new AppException(ErrorCode.INTERNAL_ERROR, "Cannot create folder");
        }

        return ResponseEntity.ok(folder);
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Transactional
    public ResponseEntity<MediaAssetJpaEntity> upload(
            @RequestParam MultipartFile file,
            @RequestParam(required = false) String folder,
            @RequestParam(required = false) String name
    ) {
        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.BAD_REQUEST, "File is required");
        }

        folder = sanitizeFolder(folder);
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() == null ? "media" : file.getOriginalFilename());
        String extension = extension(originalFilename);
        String filename = UUID.randomUUID().toString().replace("-", "") + extension;
        Path targetFolder = storageDir.resolve(folder).normalize();
        Path target = targetFolder.resolve(filename).normalize();
        if (!target.startsWith(storageDir)) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Invalid folder");
        }

        try {
            Files.createDirectories(targetFolder);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new AppException(ErrorCode.INTERNAL_ERROR, "Cannot save file");
        }

        String urlPath = "/uploads/" + folder + "/" + filename;
        MediaAssetJpaEntity entity = new MediaAssetJpaEntity();
        entity.setFolder(folder);
        entity.setName(StringUtils.hasText(name) ? name : originalFilename);
        entity.setOriginalFilename(originalFilename);
        entity.setUrl(toAbsoluteUrl(urlPath));
        entity.setStoragePath(target.toString());
        entity.setContentType(file.getContentType());
        entity.setMediaType(inferMediaType(file.getContentType(), originalFilename));
        entity.setSizeBytes(file.getSize());
        entity.setExternal(false);
        return ResponseEntity.ok(repository.save(entity));
    }

    @PostMapping("/link")
    @Transactional
    public ResponseEntity<MediaAssetJpaEntity> createLink(@Valid @RequestBody LinkRequest request) {
        MediaAssetJpaEntity entity = new MediaAssetJpaEntity();
        entity.setFolder(sanitizeFolder(request.folder()));
        entity.setName(request.name());
        entity.setOriginalFilename(request.name());
        entity.setUrl(request.url());
        entity.setContentType(null);
        entity.setMediaType(inferMediaType(null, request.url()));
        entity.setSizeBytes(0L);
        entity.setExternal(true);
        return ResponseEntity.ok(repository.save(entity));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<MediaAssetJpaEntity> update(@PathVariable Long id, @Valid @RequestBody UpdateRequest request) {
        MediaAssetJpaEntity entity = repository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Media not found"));
        entity.setFolder(sanitizeFolder(request.folder()));
        entity.setName(request.name());
        if (StringUtils.hasText(request.url())) {
            entity.setUrl(request.url());
            entity.setMediaType(inferMediaType(entity.getContentType(), request.url()));
            entity.setExternal(!request.url().contains("/uploads/"));
        }
        return ResponseEntity.ok(repository.save(entity));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        MediaAssetJpaEntity entity = repository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Media not found"));
        entity.markDeleted(null);
        repository.save(entity);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/restore")
    @Transactional
    public ResponseEntity<Void> restore(@PathVariable Long id) {
        boolean restored = trashQuerySupport.restore(MediaAssetJpaEntity.class, id);
        if (!restored) {
            throw new AppException(ErrorCode.NOT_FOUND, "Media not found in trash");
        }
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/hard")
    @Transactional
    public ResponseEntity<Void> hardDelete(@PathVariable Long id) {
        MediaAssetJpaEntity entity = findIncludingTrash(id);
        if (!Boolean.TRUE.equals(entity.getExternal()) && StringUtils.hasText(entity.getStoragePath())) {
            try {
                Files.deleteIfExists(Path.of(entity.getStoragePath()));
            } catch (IOException ignored) {
                // Metadata deletion should still continue if the file was already removed.
            }
        }
        boolean deleted = trashQuerySupport.hardDelete(MediaAssetJpaEntity.class, id);
        if (!deleted) {
            throw new AppException(ErrorCode.NOT_FOUND, "Media not found");
        }
        return ResponseEntity.noContent().build();
    }

    private MediaAssetJpaEntity findIncludingTrash(Long id) {
        MediaAssetJpaEntity entity = trashQuerySupport.findByIdIncludingDeleted(MediaAssetJpaEntity.class, id);
        if (entity == null) {
            throw new AppException(ErrorCode.NOT_FOUND, "Media not found");
        }
        return entity;
    }

    private List<String> listFolders() {
        List<String> folders = new ArrayList<>(repository.findDistinctFolders());
        if (Files.isDirectory(storageDir)) {
            try (Stream<Path> stream = Files.walk(storageDir)) {
                stream.filter(Files::isDirectory)
                        .filter(path -> !path.equals(storageDir))
                        .map(storageDir::relativize)
                        .map(path -> path.toString().replace("\\", "/"))
                        .map(this::sanitizeFolder)
                        .forEach(folders::add);
            } catch (IOException ignored) {
                // Database folders are still usable if the filesystem scan fails.
            }
        }
        return folders.stream()
                .filter(StringUtils::hasText)
                .distinct()
                .sorted(Comparator.naturalOrder())
                .toList();
    }

    private String sanitizeFolder(String value) {
        String folder = StringUtils.hasText(value) ? value.trim() : "general";
        folder = folder.replace("\\", "/").replaceAll("[^a-zA-Z0-9/_-]", "-");
        folder = folder.replaceAll("/+", "/").replaceAll("^/|/$", "");
        return folder.isBlank() ? "general" : folder.toLowerCase(Locale.ROOT);
    }

    private String extension(String filename) {
        int dot = filename.lastIndexOf('.');
        return dot >= 0 ? filename.substring(dot).toLowerCase(Locale.ROOT) : "";
    }

    private String inferMediaType(String contentType, String filename) {
        String source = ((contentType == null ? "" : contentType) + " " + filename).toLowerCase(Locale.ROOT);
        if (source.contains("video") || source.matches(".*\\.(mp4|webm|mov|m4v)$")) {
            return "VIDEO";
        }
        if (source.contains("image") || source.matches(".*\\.(jpg|jpeg|png|gif|webp|svg)$")) {
            return "IMAGE";
        }
        return "OTHER";
    }

    private String toAbsoluteUrl(String path) {
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path(path)
                .build()
                .toUriString();
    }

    public record LinkRequest(
            @NotBlank String folder,
            @NotBlank String name,
            @NotBlank String url
    ) {
    }

    public record FolderRequest(
            @NotBlank String folder
    ) {
    }

    public record UpdateRequest(
            @NotBlank String folder,
            @NotBlank String name,
            String url
    ) {
    }
}
