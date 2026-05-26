# Database Setup

Backend co san dependency cho H2 va MySQL. Cau hinh mac dinh hien dang ket noi MySQL that, co the override bang bien moi truong khi can doi moi truong.

## Cau Hinh Hien Tai

File:

```text
src/main/resources/application.properties
```

Noi dung hien tai:

```properties
spring.application.name=kf
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.generate-ddl=true
spring.jpa.hibernate.ddl-auto=${SPRING_JPA_HIBERNATE_DDL_AUTO:update}
spring.jpa.show-sql=${SPRING_JPA_SHOW_SQL:true}
spring.jpa.properties.hibernate.format_sql=${SPRING_JPA_FORMAT_SQL:true}
app.jwt.secret=${APP_JWT_SECRET}
app.jwt.expiration-ms=86400000
```

## Chay Nhanh Bang H2

Them cau hinh sau vao `application.properties` hoac profile rieng:

```properties
spring.datasource.url=jdbc:h2:mem:kf;MODE=MySQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

Neu can H2 console:

```properties
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

Console:

```text
http://localhost:8080/h2-console
```

## Chay Bang MySQL

Tao database:

```sql
CREATE DATABASE korea_fashion CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Cau hinh mau:

```properties
spring.datasource.url=jdbc:mysql://your-db-host:3306/korea_fashion?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.generate-ddl=true
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

Khuyen nghi production:

```properties
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
```

## Tables

JPA entities hien map toi cac bang:

- `admins`
- `members`
- `guest_customers`
- `users`
- `roles`
- `products`
- `categories`
- `variants`
- `orders`
- `order_items`
- `carts`
- `cart_items`
- `promotions`
- `sizes`
- `colors`
- `suppliers`
- `purchase_receipts`
- `purchase_receipt_items`
- `reviews`
- `payments`
- `shippers`

## Seed Data

`infrastructure/persistence/seed/DataSeeder` chay luc startup:

- Tao `ROLE_USER` neu chua co.
- Tao user `admin` neu chua co.

Thong tin seed mac dinh:

```text
username: admin
password: adminpass
email: admin@example.com
role: ROLE_USER
```

## Migration

Hien project chua co Flyway/Liquibase. Trong giai doan dev co the dung:

```properties
spring.jpa.hibernate.ddl-auto=update
```

Khi on dinh schema, nen them migration tool va chuyen sang:

```properties
spring.jpa.hibernate.ddl-auto=validate
```

## Bao Mat Config

Khong nen commit secret production. Nen truyen qua environment:

```powershell
$env:APP_JWT_SECRET="replace-with-long-random-secret"
```

Sau do map trong properties:

```properties
app.jwt.secret=${APP_JWT_SECRET:replace-with-long-random-secret}
```
