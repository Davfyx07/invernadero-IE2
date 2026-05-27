# ─── Etapa 1: Build ─────────────────────────────────
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B

# ─── Etapa 2: Runtime ───────────────────────────────
FROM eclipse-temurin:21-jre-alpine

# Crear usuario seguro del sistema
RUN addgroup -S cenit && adduser -S cenit -G cenit

WORKDIR /app

# Copiar el JAR asegurando que el dueño sea el usuario 'cenit'
COPY --from=build --chown=cenit:cenit /app/target/*.jar app.jar

# Cambiar al usuario no-root para la ejecución
USER cenit

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]