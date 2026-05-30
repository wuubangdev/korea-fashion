# Korea Fashion

Korea Fashion la monorepo cho website thuong mai dien tu thoi trang Han Quoc.

## Cong nghe

- Backend: Spring Boot, Java 21, Maven, Spring Security, JPA, MySQL
- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Ha tang local: Docker Compose voi MySQL, backend va frontend

## Cau truc

```text
apps/
  kf_be/   Backend Spring Boot
  kf_fe/   Frontend Next.js
docker-compose.yml
docker-compose.prod.yml
.env.example
```

## Cai dat moi truong

Tao file `.env` tu file mau:

```bash
cp .env.example .env
```

Bien moi truong quan trong:

```env
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/kf?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=kf
SPRING_DATASOURCE_PASSWORD=kf_password
APP_JWT_SECRET=replace-with-long-random-secret
APP_CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080

LOCAL_MYSQL_DATABASE=kf
LOCAL_MYSQL_USER=kf
LOCAL_MYSQL_PASSWORD=kf_password
LOCAL_MYSQL_ROOT_PASSWORD=root_password
LOCAL_MYSQL_PORT=3306

BACKEND_PORT=8080
FRONTEND_PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Khong commit `.env` hoac secret that len Git.

## Chay bang Docker

```bash
docker compose up -d --build
```

URL mac dinh:

- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- MySQL: localhost:3306

Dung service:

```bash
docker compose down
```

Xoa ca du lieu MySQL local:

```bash
docker compose down -v
```

## Chay backend

Yeu cau Java 21 va Maven.

```bash
cd apps/kf_be
mvn spring-boot:run
```

Test va build:

```bash
cd apps/kf_be
mvn -B -ntp test
mvn -B -ntp package
```

## Chay frontend

Yeu cau Node.js va Yarn hoac npm.

```bash
cd apps/kf_fe
yarn install
yarn dev
```

Lint va build:

```bash
cd apps/kf_fe
yarn lint
yarn build
```

Neu dung npm:

```bash
cd apps/kf_fe
npm install
npm run dev
```

## Deploy production

Production dung `docker-compose.prod.yml` va file `.env.production` dat truc tiep tren server.

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build --remove-orphans
```

Voi domain HTTPS, frontend nen goi API qua subdomain backend rieng:

```env
NEXT_PUBLIC_API_URL=https://api.sieunhon.top
APP_CORS_ALLOWED_ORIGINS=https://sieunhan.top,https://www.sieunhan.top,http://sieunhan.top,http://www.sieunhan.top
BACKEND_BIND_HOST=127.0.0.1
BACKEND_PORT=3398
FRONTEND_BIND_HOST=127.0.0.1
FRONTEND_PORT=3397
SERVER_FORWARD_HEADERS_STRATEGY=framework
```

Kiem tra container va log:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml ps
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f
```

## Ghi chu

- Khong commit thu muc sinh tu dong nhu `node_modules`, `.next`, `target`.
- File seed du lieu nen chuyen sang script backend/frontend chinh thuc neu con can dung lau dai.
- Tai lieu du an duoc gom ve file README nay de repo gon hon.

## Thanh vien

1. Le Vu Bang
2. Mai Quoc Dai
3. Nguyen Duy Tuan
