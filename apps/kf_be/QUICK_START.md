# Quick Start

Huong dan chay nhanh backend Korea Fashion tren may local.

## Yeu Cau

- Java 21
- Maven wrapper co san trong project
- Port `8080` dang trong
- Database tuy chon: H2 cho dev nhanh, MySQL neu can ket noi database that

## Chay Backend

Tu root repo:

```powershell
cd apps\kf_be
.\mvnw.cmd spring-boot:run
```

Linux/macOS:

```bash
cd apps/kf_be
./mvnw spring-boot:run
```

App mac dinh chay tai:

```text
http://localhost:8080
```

Swagger UI:

```text
http://localhost:8080/swagger-ui/index.html
```

## Tai Khoan Seed

`DataSeeder` se tao role va user admin neu chua co:

```text
username: admin
password: adminpass
role: ROLE_USER
```

Neu can admin dung role `ROLE_ADMIN`, can cap nhat logic seed hoac sua truc tiep du lieu role trong database.

## Dang Ky/Dang Nhap

Dang ky:

```powershell
curl -X POST http://localhost:8080/api/auth/register `
  -H "Content-Type: application/json" `
  -d "{\"username\":\"user1\",\"password\":\"secret\",\"email\":\"user1@example.com\"}"
```

Dang nhap:

```powershell
curl -X POST http://localhost:8080/api/auth/login `
  -H "Content-Type: application/json" `
  -d "{\"username\":\"user1\",\"password\":\"secret\"}"
```

Response se co `token`. Dung token do cho cac API duoc bao ve:

```powershell
curl http://localhost:8080/api/products `
  -H "Authorization: Bearer <token>"
```

## Endpoint Nen Thu Truoc

- `GET /api/products?page=0&size=10&sort=id,desc`
- `GET /api/categories?page=0&size=10&sort=id,desc`
- `GET /api/variants?page=0&size=10&sort=id,desc`
- `GET /api/orders?page=0&size=10&sort=id,desc`

## Lenh Test

```powershell
.\mvnw.cmd test
```

## Loi Hay Gap

- `401 Missing Authorization header`: thieu header `Authorization: Bearer <token>`.
- `401 Invalid or expired token`: token sai hoac het han.
- `403 Insufficient role`: token hop le nhung role khong du cho endpoint.
- Loi datasource: them cau hinh `spring.datasource.*` trong `application.properties` hoac profile rieng.
