# Korea Fashion

Monorepo for the Korea Fashion application.

- `apps/kf_be`: Spring Boot backend, Java 21, Maven
- `apps/kf_fe`: Next.js frontend, React, Yarn
- `docker-compose.yml`: local stack with MySQL, backend, and frontend
- `.github/workflows`: CI validation workflows split by changed paths

## Requirements

- Docker and Docker Compose
- Java 21, if running backend without Docker
- Node.js 24 and Yarn, if running frontend without Docker

## Environment

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

Default values:

```env
MYSQL_DATABASE=korea_fashion
MYSQL_USER=your_mysql_user
MYSQL_PASSWORD=your_mysql_password
SPRING_DATASOURCE_URL=jdbc:mysql://your-db-host:3399/korea_fashion?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=your_mysql_user
SPRING_DATASOURCE_PASSWORD=your_mysql_password
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false
SPRING_JPA_FORMAT_SQL=false
APP_JWT_SECRET=replace-with-long-random-secret
APP_CORS_ALLOWED_ORIGINS=*

LOCAL_MYSQL_DATABASE=kf
LOCAL_MYSQL_USER=kf
LOCAL_MYSQL_PASSWORD=kf_password
LOCAL_MYSQL_ROOT_PASSWORD=root_password
LOCAL_MYSQL_PORT=3306

BACKEND_PORT=8080
FRONTEND_PORT=3000
MYSQL_PORT=3306
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Do not commit real secrets. `.env` files are ignored by Git.

## Run With Docker

Build and start the full stack:

```bash
docker compose up --build
```

Run in the background:

```bash
docker compose up -d --build
```

Stop services:

```bash
docker compose down
```

Remove containers and MySQL data volume:

```bash
docker compose down -v
```

Service URLs:

- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- MySQL mac dinh cua backend: gia tri trong `.env`
- MySQL container local neu can dung rieng: `localhost:3306`

## Backend

Run tests:

```bash
cd apps/kf_be
mvn -B -ntp test
```

Build jar:

```bash
cd apps/kf_be
mvn -B -ntp package
```

Run locally:

```bash
cd apps/kf_be
mvn spring-boot:run
```

Backend Docker image:

```bash
docker build -f apps/kf_be/Dockerfile -t kor-fashion-backend:local .
```

## Frontend

Install dependencies:

```bash
cd apps/kf_fe
yarn install --frozen-lockfile
```

Run development server:

```bash
cd apps/kf_fe
yarn dev
```

Lint and build:

```bash
cd apps/kf_fe
yarn lint
yarn build
```

Frontend Docker image:

```bash
docker build -f apps/kf_fe/Dockerfile -t kor-fashion-frontend:local .
```

## CI/CD

GitHub Actions are configured in:

- `.github/workflows/ci.yml`
- `docker-compose.prod.yml`

CI validates backend/frontend changes and Docker Compose configuration. Production deployment is manual on the VPS:

```bash
cd /home/study/korea-fashion
git pull origin main
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build --remove-orphans
```

### Production Setup

On an Ubuntu VPS, install Git and Docker:

```bash
sudo apt update
sudo apt install -y git docker.io docker-compose-v2
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"
```

Log out and SSH in again after adding the Docker group. Clone this repository on the VPS:

```bash
mkdir -p /home/study/korea-fashion
git clone https://github.com/wuubangdev/korea-fashion.git /home/study/korea-fashion
cd /home/study/korea-fashion
```

Create `/home/study/korea-fashion/.env.production` directly on the VPS. Do not commit this file:

```env
SPRING_DATASOURCE_URL=jdbc:mysql://103.173.66.91:3399/korea_fashion?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=<database-password>
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false
SPRING_JPA_FORMAT_SQL=false
APP_JWT_SECRET=<long-random-jwt-secret>
APP_CORS_ALLOWED_ORIGINS=*

BACKEND_PORT=3398
FRONTEND_PORT=3397
NEXT_PUBLIC_API_URL=http://103.173.66.91:3398
```

Generate a JWT secret on the VPS with `openssl rand -base64 48`. Production Compose exposes frontend port `3397`, backend port `3398`, and connects to the existing external MySQL service on port `3399`.
Keep `SPRING_JPA_HIBERNATE_DDL_AUTO=update` while the schema is still changing so Hibernate can add new tables and columns on startup. If a column still is not created, inspect backend logs for `alter table` errors and confirm the database user has `ALTER`, `CREATE`, and `INDEX` privileges.

Run the first deploy manually on the VPS:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
docker compose --env-file .env.production -f docker-compose.prod.yml ps
```

Allow application ports in the VPS firewall when required:

```bash
sudo ufw allow 3397/tcp
sudo ufw allow 3398/tcp
```

After pulling new code and rebuilding on the VPS, open `http://103.173.66.91:3397` for the frontend and `http://103.173.66.91:3398` for the backend. Inspect containers on the VPS with:

```bash
cd /home/study/korea-fashion
docker compose --env-file .env.production -f docker-compose.prod.yml ps
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f
```

## Repository Notes

`apps/kf_fe` is managed as a normal folder inside this repository, not as a nested Git repository or submodule.

Generated folders such as `node_modules`, `.next`, `target`, and local environment files are ignored.

## Authors

1. Le Vu Bang - Main author
2. Mai Quoc Dai
3. Nguyen Duy Tuan
