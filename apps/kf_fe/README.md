# Korea Fashion Frontend

Frontend cho Korea Fashion, xây dựng bằng Next.js 16, React 19, TypeScript và Tailwind CSS.

## Yêu cầu

- Node.js 24
- Yarn Classic (qua Corepack)

## Cài đặt và chạy local

Từ thư mục `apps/kf_fe`, cài dependencies:

```bash
corepack enable
yarn install --frozen-lockfile
```

Frontend gọi backend qua biến môi trường `NEXT_PUBLIC_API_URL`. Khi chạy stack local từ thư mục gốc repository, đặt giá trị sau trong `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Chạy môi trường phát triển:

```bash
yarn dev
```

Ứng dụng mặc định chạy tại `http://localhost:3000`.

## Kiểm tra chất lượng

```bash
yarn lint
yarn build
```

`yarn lint` chạy ESLint. `yarn build` chạy kiểm tra TypeScript và tạo production build.

## Chạy bằng Docker

Từ thư mục gốc repository, dùng Docker Compose để chạy đầy đủ frontend, backend và database:

```bash
docker compose up --build
```

Xem [README ở thư mục gốc](../../README.md) để biết cấu hình biến môi trường, các cổng dịch vụ và hướng dẫn triển khai production.
