# API Testing

Tai lieu nay gom cac request mau de test nhanh backend. Cac vi du dung PowerShell `curl`.

Base URL:

```text
http://localhost:8080
```

## 1. Auth

Dang ky user:

```powershell
curl -X POST http://localhost:8080/api/auth/register `
  -H "Content-Type: application/json" `
  -d "{\"username\":\"tester\",\"password\":\"secret\",\"email\":\"tester@example.com\"}"
```

Dang nhap:

```powershell
curl -X POST http://localhost:8080/api/auth/login `
  -H "Content-Type: application/json" `
  -d "{\"username\":\"tester\",\"password\":\"secret\"}"
```

Copy gia tri `token` tu response va gan vao bien:

```powershell
$token = "<paste-token-here>"
```

Header dung chung:

```powershell
$headers = @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" }
```

## 2. Products

Tao product:

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/products" -Headers $headers -Body '{
  "name": "Korean Hoodie",
  "description": "Oversized hoodie",
  "imageUrl": "https://example.com/hoodie.jpg",
  "price": 450000,
  "brand": "KF",
  "origin": "Korea"
}'
```

Lay danh sach:

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/products?page=0&size=10&sort=id,desc" -Headers $headers
```

Tim kiem:

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/products?search=hoodie&page=0&size=10&sort=name,asc" -Headers $headers
```

Cap nhat:

```powershell
Invoke-RestMethod -Method Put -Uri "http://localhost:8080/api/products/1" -Headers $headers -Body '{
  "name": "Korean Hoodie Updated",
  "description": "Updated description",
  "imageUrl": "https://example.com/hoodie.jpg",
  "price": 499000,
  "brand": "KF",
  "origin": "Korea"
}'
```

Xoa:

```powershell
Invoke-RestMethod -Method Delete -Uri "http://localhost:8080/api/products/1" -Headers $headers
```

## 3. Categories

Tao category:

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/categories" -Headers $headers -Body '{
  "name": "Hoodie",
  "description": "Ao hoodie"
}'
```

List:

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/categories?page=0&size=10&sort=id,desc" -Headers $headers
```

## 4. Variants

Tao variant:

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/variants" -Headers $headers -Body '{
  "productId": 1,
  "size": "M",
  "color": "Black",
  "sku": "KF-HOODIE-BLK-M",
  "stock": 20,
  "price": 450000
}'
```

List theo product:

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/variants/product/1?page=0&size=10&sort=id,desc" -Headers $headers
```

## 5. Orders And Shipping

Tao order:

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/orders" -Headers $headers -Body '{
  "deliveryAddress": "123 Nguyen Trai, HCM",
  "note": "Call before delivery",
  "items": [
    {
      "productId": 1,
      "variantId": 1,
      "quantity": 2,
      "unitPrice": 450000
    }
  ]
}'
```

Gan shipper:

```powershell
Invoke-RestMethod -Method Put -Uri "http://localhost:8080/api/orders/1/shipper" -Headers $headers -Body '{
  "shipperId": "S001"
}'
```

Cap nhat shipping status:

```powershell
Invoke-RestMethod -Method Put -Uri "http://localhost:8080/api/orders/1/shipping-status" -Headers $headers -Body '{
  "shippingStatus": "SHIPPING"
}'
```

List order theo shipper:

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/orders/shipper/S001?page=0&size=10&sort=id,desc" -Headers $headers
```

## 6. Generic CRUD

Vi du tao shipper:

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/shippers" -Headers $headers -Body '{
  "id": "S001",
  "fullName": "Nguyen Van A",
  "phone": "0909000000",
  "vehicle": "Bike",
  "area": "HCM",
  "status": "ACTIVE"
}'
```

List shipper:

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/shippers?page=0&size=10&sort=id,asc" -Headers $headers
```

Generic CRUD endpoints co cung pattern:

```text
POST   /api/<resource>
GET    /api/<resource>?search=&page=0&size=10&sort=id,desc
GET    /api/<resource>/{id}
PUT    /api/<resource>/{id}
DELETE /api/<resource>/{id}
```

## 7. Expected Error Responses

Thieu token:

```json
{
  "error": "Missing Authorization header"
}
```

Token sai/het han:

```json
{
  "error": "Invalid or expired token"
}
```

Khong du role:

```json
{
  "error": "Insufficient role"
}
```

Validation fail:

```json
{
  "fieldName": "validation message"
}
```
