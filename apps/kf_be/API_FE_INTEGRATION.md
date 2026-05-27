# Korea Fashion Backend API cho FE

Tài liệu này mô tả các endpoint FE cần dùng sau khi backend được mở rộng. Mặc định base URL khi chạy local là:

```text
http://localhost:8080
```

Swagger UI:

```text
GET /swagger-ui.html
GET /v3/api-docs
```

## Quy ước chung

### Success response

Các response thành công được wrap thống nhất:

```json
{
  "success": true,
  "message": "OK",
  "data": {},
  "timestamp": "2026-05-27T07:00:00Z"
}
```

### Error response

Lỗi nghiệp vụ/validation trả về:

```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "status": 400,
  "message": "Dữ liệu không hợp lệ",
  "path": "/api/products",
  "timestamp": "2026-05-27T07:00:00Z",
  "errors": [
    {
      "field": "name",
      "message": "must not be blank"
    }
  ]
}
```

### Pagination

Các API list phân trang trả về `data` dạng:

```json
{
  "content": [],
  "page": 0,
  "size": 12,
  "totalElements": 100,
  "totalPages": 9
}
```

### Auth

Các API storefront/catalog GET công khai không cần token. Các API tạo/sửa/xóa hoặc admin cần JWT:

```http
Authorization: Bearer <accessToken>
```

Hard delete chỉ dành cho `ADMIN`.

## Authentication

### Đăng nhập

```http
POST /api/auth/login
```

Request:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

Response `data`:

```json
{
  "accessToken": "jwt-token",
  "tokenType": "Bearer",
  "username": "admin",
  "roles": ["ROLE_ADMIN"]
}
```

### Đăng ký khách hàng

```http
POST /api/auth/register
```

Request:

```json
{
  "username": "customer01",
  "password": "123456"
}
```

## Storefront public APIs

Các API trong phần này dùng cho website bán hàng và không cần JWT.

### Trang chủ

```http
GET /api/storefront/home
```

Trả về:

- `siteSettings`: logo, màu sắc, SEO, footer, social.
- `banners`: banner active.
- `categories`: danh mục active.
- `featuredProducts`: sản phẩm nổi bật.
- `newArrivals`: sản phẩm mới.
- `bestSellers`: sản phẩm bán chạy.
- `saleProducts`: sản phẩm đang giảm giá.

### Danh sách sản phẩm

```http
GET /api/storefront/products
```

Query params:

| Param | Type | Mô tả | Ví dụ |
| --- | --- | --- | --- |
| `search` | string | Từ khóa tìm kiếm | `váy công sở` |
| `categoryId` | number | ID danh mục | `1` |
| `brand` | string | Tên brand legacy | `Korea Fashion` |
| `brandId` | string | ID thương hiệu | `brand-korea` |
| `collectionId` | string | ID collection | `summer-2026` |
| `gender` | string | Nhóm khách hàng | `WOMEN` |
| `style` | string | Phong cách | `MINIMAL` |
| `season` | string | Mùa | `SUMMER` |
| `priceMin` | number | Giá thấp nhất | `100000` |
| `priceMax` | number | Giá cao nhất | `500000` |
| `inStock` | boolean | Chỉ lấy còn hàng | `true` |
| `featured` | boolean | Sản phẩm nổi bật | `true` |
| `newArrival` | boolean | Hàng mới | `true` |
| `bestSeller` | boolean | Bán chạy | `true` |
| `sale` | boolean | Đang giảm giá | `true` |
| `page` | number | Trang, bắt đầu từ 0 | `0` |
| `size` | number | Số item mỗi trang | `12` |
| `sort` | string | `field,direction` | `id,desc`, `price,asc` |

Ví dụ:

```http
GET /api/storefront/products?search=dress&priceMin=100000&priceMax=600000&page=0&size=12&sort=id,desc
```

Mỗi item sản phẩm có các field chính:

```json
{
  "id": 1,
  "name": "Áo sơ mi trắng",
  "slug": "ao-so-mi-trang",
  "description": "Mô tả dài",
  "shortDescription": "Mô tả ngắn",
  "imageUrl": "https://...",
  "price": 350000,
  "compareAtPrice": 450000,
  "brand": "Korea Fashion",
  "brandId": "brand-korea",
  "categoryId": 1,
  "collectionId": "summer-2026",
  "status": "ACTIVE",
  "stockQuantity": 20,
  "featured": true,
  "newArrival": true,
  "bestSeller": false,
  "sale": true,
  "soldCount": 120,
  "ratingAverage": 4.8,
  "reviewCount": 34
}
```

### Chi tiết sản phẩm

```http
GET /api/storefront/products/{slugOrId}
```

Ví dụ:

```http
GET /api/storefront/products/ao-so-mi-trang
GET /api/storefront/products/1
```

Response `data` gồm thông tin sản phẩm giàu hơn list:

- `origin`, `sku`, `material`, `fabricComposition`, `careInstructions`.
- `fit`, `style`, `occasion`, `length`, `neckline`, `sleeveLength`, `pattern`.
- `gender`, `season`, `countryOfManufacture`, `madeIn`.
- `warrantyPolicy`, `returnPolicy`.
- `viewCount`, `soldCount`, `ratingAverage`, `reviewCount`.
- `seoTitle`, `seoDescription`.
- `images`, `attributes`, `options`, `optionValues`, `variants`.

Ví dụ các mảng con:

```json
{
  "images": [
    {
      "id": 1,
      "imageUrl": "https://...",
      "altText": "Áo sơ mi trắng mặt trước",
      "displayOrder": 1,
      "primaryImage": true
    }
  ],
  "attributes": [
    {
      "id": 1,
      "attributeKey": "Chất liệu",
      "attributeValue": "Cotton 100%",
      "groupName": "Thông số",
      "displayOrder": 1
    }
  ],
  "options": [
    {
      "id": 1,
      "code": "SIZE",
      "name": "Size",
      "type": "TEXT",
      "displayOrder": 1,
      "required": true,
      "filterable": true
    }
  ],
  "optionValues": [
    {
      "id": 1,
      "optionId": 1,
      "code": "M",
      "value": "M",
      "colorHex": null,
      "imageUrl": null,
      "displayOrder": 2
    }
  ],
  "variants": [
    {
      "id": 10,
      "sku": "SMI-WHT-M",
      "quantity": 20,
      "availableQuantity": 18,
      "price": 350000,
      "compareAtPrice": 450000,
      "size": "M",
      "color": "White",
      "colorHex": "#FFFFFF",
      "imageUrl": "https://..."
    }
  ]
}
```

### Sản phẩm liên quan

```http
GET /api/storefront/products/{slugOrId}/related?size=8
```

Backend ưu tiên bảng `product_relations`. Nếu chưa cấu hình relation thì fallback theo category/brand/collection.

### Bộ lọc catalog

```http
GET /api/storefront/filters
```

Trả về danh sách:

- `categories`
- `brands`
- `collections`
- `tags`

### Gợi ý tìm kiếm

```http
GET /api/storefront/search/suggestions?search=ao&size=8
```

Trả về page result các product summary.

## Storefront content APIs

### Danh mục active

```http
GET /api/storefront/categories
```

### Banner active

```http
GET /api/storefront/banners
```

### Site settings

```http
GET /api/storefront/site-settings
```

FE dùng các field:

- `siteName`, `siteDescription`
- `mainLogoUrl`, `footerLogoUrl`
- `primaryColor`, `secondaryColor`, `accentColor`, `backgroundColor`, `textColor`
- `facebookUrl`, `instagramUrl`, `tiktokUrl`, `youtubeUrl`
- `hotline`, `email`, `address`, `footerAbout`
- `seoTitle`, `seoDescription`, `seoKeywords`, `seoThumbnailUrl`, `canonicalUrl`

### Shipping methods

```http
GET /api/storefront/shipping-methods
```

### Payment methods

```http
GET /api/storefront/payment-methods
```

### Store policies

```http
GET /api/storefront/policies
GET /api/storefront/policies/{slug}
```

### Pages

```http
GET /api/storefront/pages
GET /api/storefront/pages/{slug}
```

FE dùng cho trang tĩnh như giới thiệu, hướng dẫn mua hàng, landing page.

### Menus

```http
GET /api/storefront/menus/{code}
```

Ví dụ:

```http
GET /api/storefront/menus/HEADER
GET /api/storefront/menus/FOOTER
GET /api/storefront/menus/MOBILE
```

Menu item có các field:

- `id`
- `menuId`
- `parentId`
- `label`
- `url`
- `targetType`
- `targetId`
- `icon`
- `displayOrder`
- `active`

### Blog posts

```http
GET /api/storefront/blog-posts
GET /api/storefront/blog-posts/{slug}
```

### FAQ

```http
GET /api/storefront/faqs
```

### Validate coupon

```http
POST /api/storefront/coupons/validate
```

Request:

```json
{
  "code": "SUMMER10",
  "subtotal": 450000,
  "customerId": 1
}
```

Response `data`:

```json
{
  "valid": true,
  "message": "Coupon is valid",
  "code": "SUMMER10",
  "discountAmount": 45000,
  "freeShipping": false,
  "totalAfterDiscount": 405000
}
```

Nếu coupon không hợp lệ, HTTP vẫn có thể là `200`, nhưng `data.valid = false`:

```json
{
  "valid": false,
  "message": "Coupon not found or inactive",
  "code": null,
  "discountAmount": 0,
  "freeShipping": false,
  "totalAfterDiscount": 450000
}
```

## Public catalog CRUD reads

Các endpoint sau có thể `GET` công khai do backend không chặn read:

```text
GET /api/products
GET /api/products/{id}
GET /api/categories
GET /api/categories/{id}
GET /api/variants
GET /api/variants/{id}
GET /api/colors
GET /api/sizes
GET /api/promotions
GET /api/reviews
GET /api/review-images
GET /api/banners
GET /api/site-settings
GET /api/product-images
GET /api/brands
GET /api/product-collections
GET /api/product-attributes
GET /api/product-options
GET /api/product-option-values
GET /api/product-tags
GET /api/product-relations
GET /api/shipping-methods
GET /api/payment-methods
GET /api/store-policies
GET /api/pages
GET /api/menus
GET /api/menu-items
GET /api/blog-posts
GET /api/faqs
```

Pattern query chung:

```http
GET /api/{resource}?search=&page=0&size=10&sort=id,desc
```

## Generic CRUD pattern cho admin

Hầu hết resource admin dùng cùng pattern:

```http
POST   /api/{resource}
GET    /api/{resource}?search=&page=0&size=10&sort=id,desc
GET    /api/{resource}/{id}
PUT    /api/{resource}/{id}
DELETE /api/{resource}/{id}
DELETE /api/{resource}/{id}/hard
```

Quy ước:

- `POST`, `PUT`, `DELETE` cần JWT.
- `DELETE /{id}` là soft delete nếu entity có `deletedAt`.
- `DELETE /{id}/hard` là xóa cứng, chỉ ADMIN.
- Request body là JSON theo entity tương ứng.

## Admin catalog APIs

### Products

```http
GET    /api/products
POST   /api/products
GET    /api/products/{id}
PUT    /api/products/{id}
DELETE /api/products/{id}
DELETE /api/products/{id}/hard
```

Product hiện hỗ trợ các nhóm dữ liệu:

- Cơ bản: `name`, `slug`, `description`, `shortDescription`, `imageUrl`, `sku`.
- Giá: `price`, `compareAtPrice`, `costPrice`.
- Phân loại: `categoryId`, `brand`, `brandId`, `collectionId`, `tags`.
- Thời trang: `material`, `fabricComposition`, `careInstructions`, `fit`, `style`, `occasion`, `length`, `neckline`, `sleeveLength`, `pattern`, `gender`, `season`.
- Xuất xứ/chính sách: `origin`, `countryOfManufacture`, `madeIn`, `warrantyPolicy`, `returnPolicy`.
- Trạng thái bán: `status`, `featured`, `newArrival`, `bestSeller`, `sale`, `publishedAt`.
- Tracking: `viewCount`, `soldCount`, `ratingAverage`, `reviewCount`.
- SEO: `seoTitle`, `seoDescription`, `seoKeywords`, `seoThumbnailUrl`.
- Vận chuyển: `weight`, `packageLength`, `packageWidth`, `packageHeight`.

### Product images

```http
GET    /api/product-images
POST   /api/product-images
PUT    /api/product-images/{id}
DELETE /api/product-images/{id}
```

Body ví dụ:

```json
{
  "productId": 1,
  "imageUrl": "https://...",
  "altText": "Áo sơ mi trắng",
  "displayOrder": 1,
  "primaryImage": true,
  "active": true
}
```

### Product attributes

```http
GET    /api/product-attributes
POST   /api/product-attributes
PUT    /api/product-attributes/{id}
DELETE /api/product-attributes/{id}
```

Body ví dụ:

```json
{
  "productId": 1,
  "attributeKey": "Chất liệu",
  "attributeValue": "Cotton 100%",
  "groupName": "Thông số",
  "displayOrder": 1,
  "visible": true
}
```

### Product options và values

```http
GET    /api/product-options
POST   /api/product-options
GET    /api/product-option-values
POST   /api/product-option-values
```

Option ví dụ:

```json
{
  "productId": 1,
  "code": "COLOR",
  "name": "Màu sắc",
  "type": "COLOR",
  "displayOrder": 1,
  "required": true,
  "filterable": true,
  "active": true
}
```

Option value ví dụ:

```json
{
  "productId": 1,
  "optionId": 1,
  "code": "IVORY",
  "value": "Ivory",
  "colorHex": "#FFFFF0",
  "imageUrl": "https://...",
  "displayOrder": 1,
  "active": true
}
```

### Product relations

```http
GET    /api/product-relations
POST   /api/product-relations
PUT    /api/product-relations/{id}
DELETE /api/product-relations/{id}
```

Body ví dụ:

```json
{
  "productId": 1,
  "relatedProductId": 2,
  "relationType": "RELATED",
  "displayOrder": 1,
  "active": true
}
```

`relationType` gợi ý:

- `RELATED`: sản phẩm liên quan.
- `UPSELL`: gợi ý mua bản cao hơn.
- `CROSS_SELL`: gợi ý mua kèm.
- `SIMILAR`: sản phẩm tương tự.

### Brand, collection, tag, size, color

```text
/api/brands
/api/product-collections
/api/product-tags
/api/sizes
/api/colors
```

Dùng generic CRUD pattern.

## Order và checkout admin APIs

### Orders

```http
GET    /api/orders
POST   /api/orders
GET    /api/orders/{id}
PUT    /api/orders/{id}
DELETE /api/orders/{id}
DELETE /api/orders/{id}/hard
```

Order có các field quan trọng:

- `orderCode`
- `customerId`, `guestCustomerId`
- `customerName`, `customerPhone`, `customerEmail`
- `subtotal`, `discountTotal`, `shippingFee`, `taxTotal`, `grandTotal`
- `paymentStatus`, `fulfillmentStatus`, `shippingStatus`
- `shippingMethodId`, `paymentMethodId`, `couponCode`
- `cancelReason`
- `confirmedAt`, `packedAt`, `assignedAt`, `shippedAt`, `deliveredAt`, `cancelledAt`, `returnedAt`
- `items`

Order item snapshot:

- `productId`, `variantId`
- `productName`, `productImageUrl`
- `sku`, `size`, `color`
- `quantity`
- `price`, `unitPrice`, `discount`, `total`

### Order items

```http
GET    /api/order-items
POST   /api/order-items
PUT    /api/order-items/{id}
DELETE /api/order-items/{id}
```

## Inventory APIs

### Điều chỉnh tồn kho

```http
POST /api/inventory/adjust
```

Cần role `ADMIN` hoặc `STAFF`.

Request:

```json
{
  "productId": 1,
  "variantId": 10,
  "type": "IMPORT",
  "quantity": 20,
  "referenceType": "PURCHASE_RECEIPT",
  "referenceId": "PR-001",
  "note": "Nhập hàng đợt 1"
}
```

`type` gợi ý:

- `IMPORT`
- `SALE`
- `RETURN`
- `DAMAGE`
- `ADJUST`
- `RESERVE`
- `RELEASE`

Response `data`:

```json
{
  "variantId": 10,
  "quantity": 100,
  "reservedQuantity": 5,
  "availableQuantity": 95,
  "transactionId": 123
}
```

### Lịch sử inventory transaction

```http
GET /api/inventory-transactions?page=0&size=10&sort=id,desc
```

## Promotion và coupon admin APIs

### Promotions

```http
GET    /api/promotions
POST   /api/promotions
PUT    /api/promotions/{id}
DELETE /api/promotions/{id}
```

### Coupons

```http
GET    /api/coupons
POST   /api/coupons
GET    /api/coupons/{id}
PUT    /api/coupons/{id}
DELETE /api/coupons/{id}
DELETE /api/coupons/{id}/hard
```

Body ví dụ:

```json
{
  "id": "coupon-summer10",
  "code": "SUMMER10",
  "name": "Giảm 10% hè 2026",
  "description": "Áp dụng cho đơn từ 300k",
  "discountType": "PERCENT",
  "discountValue": 10,
  "maxDiscountAmount": 100000,
  "minOrderAmount": 300000,
  "appliesTo": "ALL",
  "productIds": null,
  "categoryIds": null,
  "customerIds": null,
  "usageLimit": 1000,
  "usageLimitPerCustomer": 1,
  "usedCount": 0,
  "stackable": false,
  "freeShipping": false,
  "active": true,
  "startsAt": "2026-06-01T00:00:00",
  "endsAt": "2026-06-30T23:59:59"
}
```

`discountType`:

- `PERCENT`
- `FIXED`

`appliesTo` gợi ý:

- `ALL`
- `PRODUCTS`
- `CATEGORIES`
- `CUSTOMERS`

### Coupon redemptions

```http
GET    /api/coupon-redemptions
POST   /api/coupon-redemptions
PUT    /api/coupon-redemptions/{id}
DELETE /api/coupon-redemptions/{id}
```

Dùng để quản lý/lưu lịch sử coupon đã dùng.

## Return, refund, exchange APIs

### Return requests

```http
GET    /api/return-requests
POST   /api/return-requests
GET    /api/return-requests/{id}
PUT    /api/return-requests/{id}
DELETE /api/return-requests/{id}
```

Body ví dụ:

```json
{
  "id": "ret-001",
  "returnCode": "RET-20260601-001",
  "orderId": "ORD-001",
  "customerId": 1,
  "customerName": "Nguyễn Văn A",
  "customerPhone": "0900000000",
  "customerEmail": "a@example.com",
  "type": "REFUND",
  "status": "PENDING",
  "reason": "Không vừa size",
  "customerNote": "Muốn đổi sang size M",
  "requestedAmount": 350000,
  "requestedAt": "2026-06-01T10:00:00"
}
```

`type` gợi ý:

- `REFUND`
- `EXCHANGE`
- `RETURN`

`status` gợi ý:

- `PENDING`
- `APPROVED`
- `REJECTED`
- `RECEIVED`
- `COMPLETED`
- `CANCELLED`

### Return items

```http
GET    /api/return-items
POST   /api/return-items
PUT    /api/return-items/{id}
DELETE /api/return-items/{id}
```

Body ví dụ:

```json
{
  "returnRequestId": "ret-001",
  "orderItemId": 12,
  "productId": 1,
  "variantId": 10,
  "productName": "Áo sơ mi trắng",
  "sku": "SMI-WHT-M",
  "quantity": 1,
  "unitPrice": 350000,
  "refundAmount": 350000,
  "conditionStatus": "NEW",
  "reason": "Không vừa size"
}
```

### Refunds

```http
GET    /api/refunds
POST   /api/refunds
PUT    /api/refunds/{id}
DELETE /api/refunds/{id}
```

Body ví dụ:

```json
{
  "id": "refund-001",
  "refundCode": "RF-20260601-001",
  "orderId": "ORD-001",
  "returnRequestId": "ret-001",
  "amount": 350000,
  "method": "BANK_TRANSFER",
  "status": "PENDING",
  "provider": "MANUAL",
  "reason": "Khách trả hàng",
  "requestedAt": "2026-06-01T10:00:00"
}
```

### Exchange orders

```http
GET    /api/exchange-orders
POST   /api/exchange-orders
PUT    /api/exchange-orders/{id}
DELETE /api/exchange-orders/{id}
```

Body ví dụ:

```json
{
  "id": "exchange-001",
  "exchangeCode": "EX-20260601-001",
  "returnRequestId": "ret-001",
  "originalOrderId": "ORD-001",
  "replacementOrderId": "ORD-002",
  "oldVariantId": 10,
  "newVariantId": 11,
  "quantity": 1,
  "priceDifference": 0,
  "status": "PENDING",
  "requestedAt": "2026-06-01T10:00:00",
  "note": "Đổi từ size S sang size M"
}
```

## Customer APIs

### Customer addresses

```http
GET    /api/customer-addresses
POST   /api/customer-addresses
PUT    /api/customer-addresses/{id}
DELETE /api/customer-addresses/{id}
```

Body ví dụ:

```json
{
  "customerId": 1,
  "guestCustomerId": null,
  "fullName": "Nguyễn Văn A",
  "phone": "0900000000",
  "email": "a@example.com",
  "addressLine1": "123 Lê Lợi",
  "addressLine2": "Tầng 2",
  "ward": "Bến Nghé",
  "district": "Quận 1",
  "province": "TP.HCM",
  "country": "Việt Nam",
  "postalCode": "700000",
  "addressType": "HOME",
  "defaultAddress": true,
  "note": "Giao giờ hành chính"
}
```

### Users, members, guest customers

```text
/api/users
/api/members
/api/guest-customers
```

Dùng generic CRUD pattern. Các API ghi cần JWT.

## Payment và shipping APIs

### Payment transactions

```http
GET    /api/payment-transactions
POST   /api/payment-transactions
PUT    /api/payment-transactions/{id}
DELETE /api/payment-transactions/{id}
```

Body ví dụ:

```json
{
  "id": "paytxn-001",
  "orderId": "ORD-001",
  "paymentMethodId": "cod",
  "provider": "COD",
  "providerTransactionId": null,
  "type": "PAYMENT",
  "status": "PENDING",
  "amount": 450000,
  "currency": "VND",
  "redirectUrl": null,
  "callbackUrl": null,
  "rawRequest": null,
  "rawResponse": null,
  "initiatedAt": "2026-06-01T10:00:00"
}
```

`type` gợi ý:

- `PAYMENT`
- `REFUND`
- `CAPTURE`
- `VOID`

`status` gợi ý:

- `PENDING`
- `PAID`
- `FAILED`
- `EXPIRED`
- `REFUNDED`

### Shipments

```http
GET    /api/shipments
POST   /api/shipments
PUT    /api/shipments/{id}
DELETE /api/shipments/{id}
```

Body ví dụ:

```json
{
  "id": "shipment-001",
  "orderId": "ORD-001",
  "shipmentCode": "SHP-20260601-001",
  "shippingMethodId": "standard",
  "carrierName": "GHN",
  "carrierServiceCode": "STANDARD",
  "trackingNumber": "GHN123456",
  "trackingUrl": "https://tracking.example/GHN123456",
  "status": "PENDING",
  "shippingFee": 30000,
  "codAmount": 450000,
  "weight": 0.5,
  "recipientAddress": "123 Lê Lợi, Quận 1, TP.HCM",
  "recipientName": "Nguyễn Văn A",
  "recipientPhone": "0900000000",
  "labelCreatedAt": "2026-06-01T10:00:00",
  "estimatedDeliveryAt": "2026-06-03T18:00:00",
  "note": "Giao giờ hành chính"
}
```

`status` gợi ý:

- `PENDING`
- `LABEL_CREATED`
- `PICKED_UP`
- `IN_TRANSIT`
- `DELIVERED`
- `FAILED`
- `RETURNED`

### Shipment events

```http
GET    /api/shipment-events
POST   /api/shipment-events
PUT    /api/shipment-events/{id}
DELETE /api/shipment-events/{id}
```

Body ví dụ:

```json
{
  "shipmentId": "shipment-001",
  "trackingNumber": "GHN123456",
  "status": "IN_TRANSIT",
  "location": "Kho Quận 1",
  "message": "Đơn hàng đang được vận chuyển",
  "eventTime": "2026-06-02T09:00:00",
  "source": "GHN"
}
```

## CMS APIs

### Pages

```http
GET    /api/pages
POST   /api/pages
PUT    /api/pages/{id}
DELETE /api/pages/{id}
```

Body ví dụ:

```json
{
  "id": "about-us",
  "title": "Về chúng tôi",
  "slug": "about-us",
  "excerpt": "Giới thiệu Korea Fashion",
  "content": "<p>Nội dung HTML hoặc markdown...</p>",
  "pageType": "STATIC",
  "status": "PUBLISHED",
  "seoTitle": "Về Korea Fashion",
  "seoDescription": "Thời trang Hàn Quốc chính hãng",
  "seoThumbnailUrl": "https://...",
  "publishedAt": "2026-06-01T10:00:00"
}
```

### Menus và menu items

```http
GET    /api/menus
POST   /api/menus
GET    /api/menu-items
POST   /api/menu-items
```

Menu ví dụ:

```json
{
  "id": "header",
  "code": "HEADER",
  "name": "Header menu",
  "placement": "HEADER",
  "active": true
}
```

Menu item ví dụ:

```json
{
  "menuId": "header",
  "parentId": null,
  "label": "Đầm",
  "url": "/collections/dam",
  "targetType": "COLLECTION",
  "targetId": "dam",
  "icon": "dress",
  "displayOrder": 1,
  "active": true
}
```

### Blog posts

```http
GET    /api/blog-posts
POST   /api/blog-posts
PUT    /api/blog-posts/{id}
DELETE /api/blog-posts/{id}
```

Body ví dụ:

```json
{
  "id": "mix-do-cong-so",
  "title": "5 cách mix đồ công sở",
  "slug": "mix-do-cong-so",
  "excerpt": "Gợi ý phối đồ đơn giản",
  "content": "<p>Nội dung bài viết...</p>",
  "authorName": "Korea Fashion",
  "category": "Style Guide",
  "thumbnailUrl": "https://...",
  "tags": "office,style,korea",
  "status": "PUBLISHED",
  "seoTitle": "5 cách mix đồ công sở",
  "seoDescription": "Gợi ý phối đồ công sở Hàn Quốc",
  "publishedAt": "2026-06-01T10:00:00"
}
```

### FAQs

```http
GET    /api/faqs
POST   /api/faqs
PUT    /api/faqs/{id}
DELETE /api/faqs/{id}
```

Body ví dụ:

```json
{
  "category": "Đổi trả",
  "question": "Tôi có thể đổi size không?",
  "answer": "Bạn có thể đổi size trong vòng 7 ngày nếu sản phẩm còn nguyên tem.",
  "displayOrder": 1,
  "active": true
}
```

## Review APIs

### Reviews

```http
GET    /api/reviews
POST   /api/reviews
PUT    /api/reviews/{id}
DELETE /api/reviews/{id}
```

Review có các field mới:

- `productId`, `userId`, `orderId`, `orderItemId`
- `rating`, `title`, `content`
- `status`
- `reviewerName`, `reviewerAvatarUrl`
- `verifiedPurchase`
- `helpfulCount`, `reportCount`
- `adminReply`, `adminRepliedAt`
- `reviewedAt`

### Review images

```http
GET    /api/review-images
POST   /api/review-images
PUT    /api/review-images/{id}
DELETE /api/review-images/{id}
```

Body ví dụ:

```json
{
  "reviewId": "rv001",
  "imageUrl": "https://...",
  "altText": "Ảnh thật sản phẩm",
  "displayOrder": 1,
  "active": true
}
```

## Audit APIs

```http
GET    /api/audit-logs
GET    /api/audit-logs/{id}
DELETE /api/audit-logs/{id}
```

Chỉ `ADMIN` nên dùng. Backend tự ghi audit log cho các request ghi dữ liệu (`POST`, `PUT`, `PATCH`, `DELETE`), trừ chính endpoint audit.

Audit log có các field:

- `actorId`, `actorName`, `actorRole`
- `action`
- `resourceType`, `resourceId`
- `requestMethod`, `requestPath`
- `ipAddress`, `userAgent`
- `beforeData`, `afterData`
- `result`, `message`, `createdTime`

## Dashboard APIs

```http
GET /api/admin/dashboard/stats
GET /api/admin/dashboard/low-stock-products
GET /api/admin/dashboard/recent-orders
```

Cần `ADMIN` hoặc `STAFF`.

FE dùng cho dashboard quản trị:

- Tổng đơn hàng/doanh thu.
- Đơn gần đây.
- Sản phẩm sắp hết hàng.

## Health

```http
GET /api/health
```

Dùng để kiểm tra backend còn chạy hay không.

## Gợi ý enum/status cho FE

### Product status

```text
DRAFT
ACTIVE
INACTIVE
ARCHIVED
```

### Payment status

```text
PENDING
PAID
FAILED
REFUNDED
EXPIRED
```

### Fulfillment/shipping status

```text
PENDING
CONFIRMED
PACKED
SHIPPED
DELIVERED
CANCELLED
RETURNED
```

### Content status

```text
DRAFT
PUBLISHED
ARCHIVED
```

### Return/refund/exchange status

```text
PENDING
APPROVED
REJECTED
PROCESSING
COMPLETED
CANCELLED
FAILED
```

