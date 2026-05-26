# Implementation Summary

Tom tat cac phan backend da duoc implement/refactor gan day.

## CRUD And Pagination

Da co CRUD va pagination cho cac aggregate chinh:

- Product
- Category
- Variant
- User
- Order

Pagination khong expose Spring `Page`/`Pageable` ra application layer. Application dung:

- `PageQuery`
- `PageResult`
- `SortDirection`

Persistence adapter chuyen `PageQuery` sang `Pageable` thong qua `PageMapper`.

## Order And Shipping

Order flow da co them cac thao tac giao hang:

- Gan shipper cho order.
- Cap nhat shipping status.
- List order theo shipper.
- Luu cac moc thoi gian shipping nhu assigned/shipped/delivered tuy theo status.

Endpoints lien quan:

- `PUT /api/orders/{id}/shipper`
- `PUT /api/orders/{id}/shipping-status`
- `GET /api/orders/shipper/{shipperId}`

## API DTO And Mappers

DTO da duoc dua ve API layer:

```text
infrastructure/api/dto/request
infrastructure/api/dto/response
```

API mappers nam tai:

```text
infrastructure/api/mapper
```

Controller khong con chua mapping auth inline; `AuthApiMapper` xu ly request/result mapping.

## Persistence Mappers

Persistence mappers nam tai:

```text
infrastructure/persistence/jpa/mapper
```

Mappers chinh:

- `ProductMapper`
- `CategoryMapper`
- `VariantMapper`
- `UserMapper`
- `RoleMapper`
- `OrderMapper`
- `OrderItemMapper`
- `PageMapper`

## Hexagonal Refactor

Da tach cac dependency framework ra khoi application/domain:

- Application service khong dung `@Service`.
- Use case duoc wire trong `UseCaseConfig`.
- Password hashing di qua `PasswordHasher`.
- JWT generation di qua `TokenProvider`.
- Persistence di qua outbound ports.
- API DTO khong nam trong application.

Generic CRUD da duoc dua qua:

```text
Controller -> GenericCrudUseCase -> GenericJpaCrudAdapter -> JpaRepository
```

## Security

Auth hien dung:

- `@RequireAuth`
- `AuthAspect`
- `JwtUtil`
- `JwtTokenProvider`
- `BCryptPasswordHasher`

`JwtAuthenticationFilter` cu da bi loai bo.

JWT co claim `roles`. `AuthAspect` co the check role khi endpoint khai bao:

```java
@RequireAuth(roles = {"ADMIN"})
```

Aspect chap nhan ca `ADMIN` va `ROLE_ADMIN`.

## Cleanup

Da cleanup:

- Repository interface rong/thua: `ProductRepository`, `RoleRepository`, `UserRepository`.
- Duplicate old seeder trong `infrastructure/seed`.
- Old JWT filter.

## Tests

Da cap nhat unit tests lien quan:

- `AuthServiceTest`
- `ProductServiceTest`

## Known Gaps

- Chua build/test lai trong buoc gan day theo yeu cau "khong can build".
- Generic CRUD cho resource phu van dung JPA entity lam body/response. Kien truc da tot hon controller -> repository, nhung neu can strict hexagonal hon nua thi nen tao domain/use case/DTO/mapper rieng cho tung aggregate phu.
- Chua co Flyway/Liquibase migration.
- Chua tach profile config cho dev/test/prod.

## Recent Commits

- `1fb3450 feat: add fashion backend CRUD and delivery flows`
- `41e6bda refactor: align backend with hexagonal architecture`
