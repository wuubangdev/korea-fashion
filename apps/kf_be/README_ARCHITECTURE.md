# Backend Architecture

Tai lieu nay mo ta kien truc hien tai cua `apps/kf_be` sau refactor theo Clean/Hexagonal Architecture.

## Muc Tieu

- Tach domain va use case khoi framework.
- De controller chi dong vai tro adapter HTTP.
- De persistence chi dong vai tro adapter database.
- Khong de Spring Data, JPA entity, API DTO ro ri vao application/domain.
- De cac logic nhu pagination, password hashing, token generation di qua port.

## Package Layers

```text
com.shope.kf
├── domain
│   └── model
├── application
│   ├── command
│   ├── common
│   ├── mapper
│   ├── port
│   │   ├── in
│   │   └── out
│   ├── result
│   └── service
├── config
└── infrastructure
    ├── aop
    ├── api
    │   ├── dto
    │   └── mapper
    ├── exception
    ├── persistence
    │   ├── adapter
    │   ├── jpa
    │   ├── repository
    │   └── seed
    └── security
```

## Dependency Direction

Cho phep:

- `infrastructure` -> `application`
- `infrastructure` -> `domain`
- `application` -> `domain`
- `config` -> `application` va `infrastructure`

Khong cho phep:

- `domain` -> Spring/JPA/API/Jakarta validation
- `application` -> Spring/JPA/API DTO/JWT utility
- Controller -> repository truc tiep

## Domain Layer

Thu muc:

```text
src/main/java/com/shope/kf/domain/model
```

Chua model nghiep vu thuan:

- `Product`
- `Variant`
- `Category`
- `User`
- `Role`
- `Order`
- `OrderItem`

Domain model hien dung Lombok de giam boilerplate, nhung khong phu thuoc JPA annotation.

## Application Layer

Thu muc:

```text
src/main/java/com/shope/kf/application
```

Thanh phan chinh:

- `port/in`: inbound use case contract, vi du `ProductUseCase`, `OrderUseCase`.
- `port/out`: outbound persistence/security contract, vi du `ProductPersistencePort`, `TokenProvider`.
- `service`: implementation use case.
- `command`: input command cho use case, vi du `AuthCommand`.
- `result`: output result cho use case, vi du `AuthResult`.
- `common`: object dung chung khong phu thuoc framework, vi du `PageQuery`, `PageResult`.

Application service khong gan `@Service`. Bean duoc wire tai `UseCaseConfig`.

## API Adapter

Thu muc:

```text
src/main/java/com/shope/kf/infrastructure/api
```

Controller nhan request HTTP, validate API DTO, map sang domain/command, goi use case, roi map sang response DTO.

Mapper API nam trong:

```text
infrastructure/api/mapper
```

DTO nam trong:

```text
infrastructure/api/dto/request
infrastructure/api/dto/response
```

## Persistence Adapter

Thu muc:

```text
src/main/java/com/shope/kf/infrastructure/persistence
```

Thanh phan:

- `jpa`: JPA entity.
- `repository`: Spring Data repository.
- `adapter`: implementation cua outbound port.
- `jpa/mapper`: map domain <-> JPA entity.

Pagination duoc chuyen doi tai `PageMapper`: application dung `PageQuery`/`PageResult`, infrastructure moi dung `Pageable`/`Page`.

## Security

Auth flow:

1. `AuthController` nhan login/register request.
2. `AuthApiMapper` map request sang `AuthCommand`.
3. `AuthService` kiem tra user/password qua output ports.
4. `TokenProvider` tao JWT co claim `roles`.
5. `AuthAspect` doc `@RequireAuth`, validate token va check role neu endpoint yeu cau.

`JwtAuthenticationFilter` cu da duoc bo. Auth hien duoc xu ly bang AOP annotation.

## Generic CRUD

Mot so resource phu dung generic CRUD:

- admin/member/guest customer
- cart/cart item
- promotion/size/color/supplier
- purchase receipt/item
- review/payment/shipper/order item

Controller khong goi repository truc tiep nua. Thay vao do:

```text
Controller -> GenericCrudUseCase -> GenericJpaCrudAdapter -> JpaRepository
```

Ghi chu: generic CRUD van gan voi JPA entity cho cac resource phu. Neu can strict hexagonal 100%, buoc tiep theo la tao domain model, DTO, mapper va use case rieng cho tung aggregate phu.

## Quy Tac Khi Them Feature

1. Tao/cap nhat domain model truoc neu co logic nghiep vu moi.
2. Them inbound port trong `application/port/in`.
3. Them outbound port trong `application/port/out` neu can database/service ngoai.
4. Implement use case trong `application/service`.
5. Implement persistence adapter trong `infrastructure/persistence/adapter`.
6. Tao API DTO va API mapper trong `infrastructure/api`.
7. Controller chi goi use case va mapper.
8. Wire bean trong `config` neu service khong dung Spring annotation.

## Check Nhanh Dependency

Lenh search de phat hien dependency nguoc:

```powershell
rg -n "import com\.shope\.kf\.infrastructure|import org\.springframework|import jakarta" apps\kf_be\src\main\java\com\shope\kf\application apps\kf_be\src\main\java\com\shope\kf\domain -S
```

Ket qua tot la khong co match.
