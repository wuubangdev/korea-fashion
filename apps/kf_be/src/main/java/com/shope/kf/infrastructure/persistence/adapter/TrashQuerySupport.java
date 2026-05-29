package com.shope.kf.infrastructure.persistence.adapter;

import com.shope.kf.application.common.PageQuery;
import com.shope.kf.application.common.PageResult;
import com.shope.kf.application.common.SortDirection;
import com.shope.kf.infrastructure.persistence.jpa.BaseJpaEntity;
import jakarta.persistence.Column;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Component
public class TrashQuerySupport {
    private final EntityManager entityManager;

    public TrashQuerySupport(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public <T> PageResult<T> listDeleted(Class<T> entityClass, String search, PageQuery pageQuery) {
        if (!supportsTrash(entityClass)) {
            return new PageResult<>(List.of(), pageQuery.page(), pageQuery.size(), 0, 0);
        }

        String table = tableName(entityClass);
        String idColumn = idColumn(entityClass);
        String sortColumn = columnForField(entityClass, pageQuery.sortBy(), idColumn);
        String direction = pageQuery.direction() == SortDirection.ASC ? "asc" : "desc";
        String where = " where deleted_at is not null";
        List<String> searchColumns = stringColumns(entityClass);
        boolean hasSearch = search != null && !search.isBlank() && !searchColumns.isEmpty();

        if (hasSearch) {
            where += " and (" + String.join(" or ", searchColumns.stream().map(column -> "lower(" + column + ") like :search").toList()) + ")";
        }

        var query = entityManager.createNativeQuery(
                "select * from " + table + where + " order by " + sortColumn + " " + direction,
                entityClass
        );
        var countQuery = entityManager.createNativeQuery("select count(*) from " + table + where);

        if (hasSearch) {
            String value = "%" + search.toLowerCase(Locale.ROOT) + "%";
            query.setParameter("search", value);
            countQuery.setParameter("search", value);
        }

        query.setFirstResult(pageQuery.page() * pageQuery.size());
        query.setMaxResults(pageQuery.size());

        @SuppressWarnings("unchecked")
        List<T> content = query.getResultList();
        long total = ((Number) countQuery.getSingleResult()).longValue();
        int totalPages = pageQuery.size() == 0 ? 0 : (int) Math.ceil((double) total / pageQuery.size());

        return new PageResult<>(content, pageQuery.page(), pageQuery.size(), total, totalPages);
    }

    public <T> boolean restore(Class<T> entityClass, Object id) {
        if (!supportsTrash(entityClass)) {
            return false;
        }

        int updated = entityManager.createNativeQuery(
                        "update " + tableName(entityClass)
                                + " set deleted_at = null, deleted_by = null, updated_at = current_timestamp"
                                + " where " + idColumn(entityClass) + " = :id and deleted_at is not null"
                )
                .setParameter("id", id)
                .executeUpdate();
        return updated > 0;
    }

    public <T> int restoreAll(Class<T> entityClass, List<?> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        if (!supportsTrash(entityClass)) {
            return 0;
        }

        return entityManager.createNativeQuery(
                        "update " + tableName(entityClass)
                                + " set deleted_at = null, deleted_by = null, updated_at = current_timestamp"
                                + " where " + idColumn(entityClass) + " in (:ids) and deleted_at is not null"
                )
                .setParameter("ids", ids)
                .executeUpdate();
    }

    public <T> boolean hardDelete(Class<T> entityClass, Object id) {
        if (!supportsTrash(entityClass)) {
            return false;
        }

        int deleted = entityManager.createNativeQuery(
                        "delete from " + tableName(entityClass) + " where " + idColumn(entityClass) + " = :id"
                )
                .setParameter("id", id)
                .executeUpdate();
        return deleted > 0;
    }

    public <T> T findByIdIncludingDeleted(Class<T> entityClass, Object id) {
        if (!supportsTrash(entityClass)) {
            return null;
        }

        @SuppressWarnings("unchecked")
        List<T> result = entityManager.createNativeQuery(
                        "select * from " + tableName(entityClass) + " where " + idColumn(entityClass) + " = :id",
                        entityClass
                )
                .setParameter("id", id)
                .setMaxResults(1)
                .getResultList();
        return result.isEmpty() ? null : result.get(0);
    }

    private boolean supportsTrash(Class<?> entityClass) {
        return BaseJpaEntity.class.isAssignableFrom(entityClass);
    }

    private String tableName(Class<?> entityClass) {
        Table table = entityClass.getAnnotation(Table.class);
        if (table != null && !table.name().isBlank()) {
            return table.name();
        }
        return camelToSnake(entityClass.getSimpleName().replaceFirst("JpaEntity$", ""));
    }

    private String idColumn(Class<?> entityClass) {
        Field id = findField(entityClass, field -> field.isAnnotationPresent(Id.class));
        return columnName(id);
    }

    private String columnForField(Class<?> entityClass, String fieldName, String fallback) {
        Field field = findField(entityClass, candidate -> candidate.getName().equals(fieldName));
        if (field == null) {
            return fallback;
        }
        return columnName(field);
    }

    private List<String> stringColumns(Class<?> entityClass) {
        List<String> columns = new ArrayList<>();
        Class<?> current = entityClass;
        while (current != null && current != Object.class) {
            for (Field field : current.getDeclaredFields()) {
                if (field.getType().equals(String.class)) {
                    columns.add(columnName(field));
                }
            }
            current = current.getSuperclass();
        }
        return columns;
    }

    private Field findField(Class<?> entityClass, java.util.function.Predicate<Field> predicate) {
        Class<?> current = entityClass;
        while (current != null && current != Object.class) {
            for (Field field : current.getDeclaredFields()) {
                if (predicate.test(field)) {
                    return field;
                }
            }
            current = current.getSuperclass();
        }
        return null;
    }

    private String columnName(Field field) {
        if (field == null) {
            return "id";
        }
        Column column = field.getAnnotation(Column.class);
        if (column != null && !column.name().isBlank()) {
            return column.name();
        }
        return camelToSnake(field.getName());
    }

    private String camelToSnake(String value) {
        return value.replaceAll("([a-z])([A-Z])", "$1_$2").toLowerCase(Locale.ROOT);
    }
}
