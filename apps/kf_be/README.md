# Korea Fashion Backend

Spring Boot backend cho ung dung Korea Fashion. Module nay cung cap API quan ly san pham thoi trang, bien the, danh muc, nguoi dung, don hang, giao hang va cac danh muc phu tro.

## Tech Stack

- Java 21
- Spring Boot 4
- Spring Web MVC
- Spring Data JPA
- Spring Security
- Jakarta Validation
- JJWT
- Lombok
- H2/MySQL driver
- Springdoc OpenAPI

## Kien Truc

Backend dang di theo Clean/Hexagonal Architecture:

- `domain`: model nghiep vu thuan, khong phu thuoc Spring/JPA.
- `application`: use case, command/result, port in/out, service nghiep vu.
- `infrastructure/api`: REST controller, API DTO, API mapper, auth annotation.
- `infrastructure/persistence`: JPA entity, repository, persistence adapter, mapper.
- `infrastructure/security`: password hasher, JWT provider, JWT utility.
- `config`: wire bean cho use case va generic CRUD adapter.

Nguyen tac chinh:

- Controller khong goi truc tiep repository.
- Application layer khong import Spring/JPA/Jakarta validation.
- DTO request/response nam o API layer.
- Pagination dung `PageQuery`/`PageResult` trong application, adapter moi chuyen sang Spring `Pageable`.
- Password hashing va token generation di qua output port.

## Chay Local

Tu thu muc backend:

```bash
cd apps/kf_be
./mvnw spring-boot:run
```

Windows:

```powershell
cd apps\kf_be
.\mvnw.cmd spring-boot:run
```

Mac dinh app dung cau hinh trong `src/main/resources/application.properties`:

```properties
spring.application.name=kf
app.jwt.secret=verysecretkeychangemeplease0123456789
app.jwt.expiration-ms=86400000
```

Neu can dung database that, bo sung datasource/JPA properties theo moi truong, vi project da co MySQL va H2 runtime dependency.

## Authentication

Dang ky:

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "user1",
  "password": "secret",
  "email": "user1@example.com"
}
```

Dang nhap:

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "user1",
  "password": "secret"
}
```

Response tra ve JWT:

```json
{
  "username": "user1",
  "token": "..."
}
```

Goi cac API duoc bao ve:

```http
Authorization: Bearer <token>
```

`@RequireAuth` kiem tra token. Co the khai bao role:

```java
@RequireAuth(roles = {"ADMIN"})
```

JWT hien co claim `roles`; aspect chap nhan ca dang `ADMIN` va `ROLE_ADMIN`.

## API Chinh

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`

Products:

- `POST /api/products`
- `GET /api/products?search=&page=0&size=10&sort=id,desc`
- `GET /api/products/{id}`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`

Categories:

- `POST /api/categories`
- `GET /api/categories?search=&page=0&size=10&sort=id,desc`
- `GET /api/categories/{id}`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`

Variants:

- `POST /api/variants`
- `GET /api/variants?search=&page=0&size=10&sort=id,desc`
- `GET /api/variants/product/{productId}`
- `GET /api/variants/{id}`
- `PUT /api/variants/{id}`
- `DELETE /api/variants/{id}`

Users:

- `POST /api/users`
- `GET /api/users?search=&page=0&size=10&sort=id,desc`
- `GET /api/users/{id}`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`

Orders:

- `POST /api/orders`
- `GET /api/orders?search=&page=0&size=10&sort=id,desc`
- `GET /api/orders/{id}`
- `GET /api/orders/shipper/{shipperId}?page=0&size=10&sort=id,desc`
- `PUT /api/orders/{id}/status?status=CONFIRMED`
- `PUT /api/orders/{id}/shipper`
- `PUT /api/orders/{id}/shipping-status`
- `DELETE /api/orders/{id}`

Generic CRUD endpoints:

- `/api/admins`
- `/api/members`
- `/api/guest-customers`
- `/api/carts`
- `/api/cart-items`
- `/api/promotions`
- `/api/sizes`
- `/api/colors`
- `/api/suppliers`
- `/api/purchase-receipts`
- `/api/purchase-receipt-items`
- `/api/reviews`
- `/api/payments`
- `/api/shippers`
- `/api/order-items`

Moi generic CRUD endpoint ho tro:

- `POST /api/<resource>`
- `GET /api/<resource>?search=&page=0&size=10&sort=id,desc`
- `GET /api/<resource>/{id}`
- `PUT /api/<resource>/{id}`
- `DELETE /api/<resource>/{id}`

## Pagination

List API tra ve `PageResult<T>`:

```json
{
  "content": [],
  "page": 0,
  "size": 10,
  "totalElements": 0,
  "totalPages": 0,
  "last": true
}
```

Query params:

- `search`: optional, tim text theo cac field string.
- `page`: default `0`.
- `size`: default `10`.
- `sort`: dang `<field>,<asc|desc>`, default `id,desc`.

## OpenAPI

Khi app dang chay, Swagger UI thuong nam tai:

```text
http://localhost:8080/swagger-ui/index.html
```

OpenAPI JSON:

```text
http://localhost:8080/v3/api-docs
```

## Test

```bash
cd apps/kf_be
./mvnw test
```

Windows:

```powershell
cd apps\kf_be
.\mvnw.cmd test
```

## Ghi Chu

- `JwtAuthenticationFilter` cu da duoc bo; auth hien di qua `AuthAspect` va `@RequireAuth`.
- Cac endpoint phu dang dung generic CRUD adapter. Neu can strict hexagonal hon nua, buoc tiep theo la tao domain/use case/DTO rieng cho tung aggregate phu.
- Secret JWT trong production nen truyen qua environment/config rieng, khong dung gia tri mac dinh trong source.
