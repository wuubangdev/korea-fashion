package com.shope.kf.infrastructure.persistence.schema;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
@ConditionalOnProperty(name = "kf.media.schema-initializer.enabled", havingValue = "true")
public class MediaAssetSchemaInitializer {
    private final JdbcTemplate jdbcTemplate;

    public MediaAssetSchemaInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void ensureMediaAssetTable() {
        jdbcTemplate.execute("""
                create table if not exists media_assets (
                    id bigint not null auto_increment,
                    version bigint,
                    created_at datetime(6),
                    updated_at datetime(6),
                    created_by varchar(100),
                    updated_by varchar(100),
                    deleted_at datetime(6),
                    deleted_by varchar(100),
                    folder varchar(120),
                    name varchar(180),
                    original_filename varchar(255),
                    url varchar(500),
                    storage_path varchar(500),
                    content_type varchar(120),
                    media_type varchar(20),
                    size_bytes bigint,
                    external_asset boolean,
                    primary key (id)
                ) engine=InnoDB
                """);
        createIndexIfMissing("idx_media_assets_folder", "create index idx_media_assets_folder on media_assets (folder)");
        createIndexIfMissing("idx_media_assets_media_type", "create index idx_media_assets_media_type on media_assets (media_type)");
    }

    private void createIndexIfMissing(String indexName, String createSql) {
        Integer count = jdbcTemplate.queryForObject(
                """
                        select count(*)
                        from information_schema.statistics
                        where table_schema = database()
                          and table_name = 'media_assets'
                          and index_name = ?
                        """,
                Integer.class,
                indexName
        );

        if (count == null || count == 0) {
            jdbcTemplate.execute(createSql);
        }
    }
}
