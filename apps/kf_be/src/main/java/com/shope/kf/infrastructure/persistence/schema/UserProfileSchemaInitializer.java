package com.shope.kf.infrastructure.persistence.schema;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.SQLException;
import java.util.Locale;

@Component
@ConditionalOnProperty(name = "kf.user-profile-schema-initializer.enabled", havingValue = "true", matchIfMissing = true)
public class UserProfileSchemaInitializer {
    private final DataSource dataSource;
    private final JdbcTemplate jdbcTemplate;

    public UserProfileSchemaInitializer(DataSource dataSource, JdbcTemplate jdbcTemplate) {
        this.dataSource = dataSource;
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void ensureUserProfileColumns() throws SQLException {
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            String databaseName = metaData.getDatabaseProductName().toLowerCase(Locale.ROOT);
            if (!databaseName.contains("mysql") && !databaseName.contains("mariadb")) {
                return;
            }
        }

        addColumnIfMissing("full_name", "varchar(120)");
        addColumnIfMissing("phone", "varchar(30)");
        addColumnIfMissing("address", "varchar(500)");
        addColumnIfMissing("city", "varchar(120)");
        addColumnIfMissing("district", "varchar(120)");
        addColumnIfMissing("ward", "varchar(120)");
        addColumnIfMissing("avatar_url", "varchar(1000)");
        jdbcTemplate.execute("alter table users modify column avatar_url varchar(1000)");
    }

    private void addColumnIfMissing(String columnName, String columnDefinition) {
        Integer count = jdbcTemplate.queryForObject(
                """
                        select count(*)
                        from information_schema.columns
                        where table_schema = database()
                          and table_name = 'users'
                          and column_name = ?
                        """,
                Integer.class,
                columnName
        );

        if (count == null || count == 0) {
            jdbcTemplate.execute("alter table users add column " + columnName + " " + columnDefinition);
        }
    }
}
