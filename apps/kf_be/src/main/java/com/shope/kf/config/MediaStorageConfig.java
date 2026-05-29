package com.shope.kf.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Files;

@Configuration
public class MediaStorageConfig implements WebMvcConfigurer {
    private final Path storageDir;
    private final String resourceLocation;

    public MediaStorageConfig(@Value("${kf.media.storage-dir:uploads}") String storageDir) {
        this.storageDir = Path.of(storageDir).toAbsolutePath().normalize();
        this.resourceLocation = this.storageDir.toUri().toString().replaceFirst("/?$", "/");

        try {
            Files.createDirectories(this.storageDir);
        } catch (IOException ex) {
            throw new IllegalStateException("Cannot initialize media storage directory: " + this.storageDir, ex);
        }
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(resourceLocation);
    }
}
