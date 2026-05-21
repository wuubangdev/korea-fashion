# Korea Fashion

Monorepo for the Korea Fashion application.

- `apps/kf_be`: Spring Boot backend, Java 21, Maven
- `apps/kf_fe`: Next.js frontend, React, Yarn
- `docker-compose.yml`: local stack with MySQL, backend, and frontend
- `.github/workflows`: CI/CD workflows split by changed paths

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
MYSQL_DATABASE=kf
MYSQL_USER=kf
MYSQL_PASSWORD=kf_password
MYSQL_ROOT_PASSWORD=root_password
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
- MySQL: `localhost:3306`

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
- `.github/workflows/cd.yml`

The workflows use path filters so one side does not rebuild everything when only the other side changes:

- Changes in `apps/kf_be/**` run backend jobs.
- Changes in `apps/kf_fe/**` run frontend jobs.
- Changes in Docker or workflow files run the relevant Docker validation/build jobs.

Docker image builds use GitHub Actions cache with separate scopes:

- `backend`
- `frontend`

This keeps backend and frontend image cache independent.

## Repository Notes

`apps/kf_fe` is managed as a normal folder inside this repository, not as a nested Git repository or submodule.

Generated folders such as `node_modules`, `.next`, `target`, and local environment files are ignored.

## Authors

1. Le Vu Bang - Main author
2. Mai Quoc Dai
3. Nguyen Duy Tuan
