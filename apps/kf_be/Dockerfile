# syntax=docker/dockerfile:1.7

FROM maven:3.9.9-eclipse-temurin-21 AS dependencies
WORKDIR /workspace

COPY apps/kf_be/pom.xml ./
RUN --mount=type=cache,target=/root/.m2 mvn -B -ntp dependency:go-offline

FROM dependencies AS build
COPY apps/kf_be/src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -B -ntp package -DskipTests

FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=build /workspace/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
