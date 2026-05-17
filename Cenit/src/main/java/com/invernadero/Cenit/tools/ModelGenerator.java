package com.invernadero.cenit.tools;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/**
 * ModelGenerator
 *
 * Corre ANTES de Flyway al arrancar Spring Boot.
 * Lee src/main/resources/modelo.json y genera
 * src/main/resources/db/migration/V1__init.sql automáticamente.
 *
 * Flujo:
 *   modelo.json → ModelGenerator → V1__init.sql → Flyway → PostgreSQL
 */
// @Component
// @Order(1) // Corre antes que cualquier otro ApplicationRunner
public class ModelGenerator implements ApplicationRunner {

    // ─── Mapeo tipos JSON → PostgreSQL ───────────────────────────────────────
    private String toPostgresType(JsonNode field) {
        String type = field.path("type").asText();
        return switch (type) {
            case "Long"     -> "BIGSERIAL";
            case "String"   -> field.has("maxLength")
                    ? "VARCHAR(" + field.path("maxLength").asInt() + ")"
                    : "TEXT";
            case "Boolean"  -> "BOOLEAN";
            case "Integer"  -> "INTEGER";
            case "Double"   -> "DOUBLE PRECISION";
            case "Date"     -> "DATE";
            case "DateTime" -> "TIMESTAMP";
            case "Text"     -> "TEXT";
            case "FK"       -> "BIGINT";
            case "Enum"     -> field.path("enumName").asText();
            default         -> "TEXT";
        };
    }

    // ─── camelCase → snake_case ───────────────────────────────────────────────
    private String toSnake(String name) {
        return name.replaceAll("([A-Z])", "_$1").toLowerCase().replaceAll("^_", "");
    }

    // ─── Genera el bloque SQL de una tabla ───────────────────────────────────
    private String buildTable(JsonNode entity) {
        StringBuilder sb = new StringBuilder();
        String tableName = entity.path("table").asText();
        String entityName = entity.path("name").asText();

        sb.append("-- ").append(entityName).append("\n");
        sb.append("CREATE TABLE ").append(tableName).append(" (\n");

        List<String> cols = new ArrayList<>();
        for (JsonNode field : entity.path("fields")) {
            String name = field.path("name").asText();
            String col  = toSnake(name);
            String type = field.path("type").asText();
            boolean pk       = field.path("pk").asBoolean(false);
            boolean nullable = field.path("nullable").asBoolean(true);
            boolean unique   = field.path("unique").asBoolean(false);

            StringBuilder colDef = new StringBuilder("    ").append(pad(col, 22));

            if (pk) {
                colDef.append("BIGSERIAL PRIMARY KEY");
                cols.add(colDef.toString());
                continue;
            }

            if ("FK".equals(type)) {
                colDef.append(pad("BIGINT", 22));
                if (!nullable) colDef.append("NOT NULL ");
                colDef.append("REFERENCES ")
                        .append(field.path("references").asText())
                        .append(" ON DELETE ")
                        .append(field.path("onDelete").asText("RESTRICT"));
                cols.add(colDef.toString());
                continue;
            }

            colDef.append(pad(toPostgresType(field), 22));
            if (!nullable) colDef.append("NOT NULL ");
            if (unique)    colDef.append("UNIQUE ");

            if (field.has("default")) {
                JsonNode def = field.path("default");
                if (def.isBoolean()) {
                    colDef.append("DEFAULT ").append(def.asBoolean() ? "TRUE" : "FALSE");
                } else if (def.isNumber()) {
                    colDef.append("DEFAULT ").append(def.asText());
                } else {
                    String dv = def.asText();
                    // Si es una función SQL (NOW(), etc.) no la envuelvas en comillas
                    if (dv.endsWith(")")) {
                        colDef.append("DEFAULT ").append(dv);
                    } else {
                        colDef.append("DEFAULT '").append(dv).append("'");
                    }
                }
            }

            cols.add(colDef.toString().trim());
        }

        sb.append(String.join(",\n", cols));
        sb.append("\n);\n");
        return sb.toString();
    }

    // ─── Padding simple para alinear columnas ─────────────────────────────────
    private String pad(String s, int width) {
        if (s.length() >= width) return s + " ";
        return s + " ".repeat(width - s.length());
    }

    // ─── Punto de entrada — corre al arrancar Spring Boot ────────────────────
    @Override
    public void run(ApplicationArguments args) throws Exception {

        System.out.println("\n========================================");
        System.out.println("  ModelGenerator — leyendo modelo.json");
        System.out.println("========================================");

        // 1. Leer modelo.json desde resources/
        ObjectMapper mapper = new ObjectMapper();
        InputStream is = new ClassPathResource("modelo.json").getInputStream();
        JsonNode model = mapper.readTree(is);

        String project = model.path("project").asText("GreenTrack");
        String version = model.path("version").asText("1.0.0");
        JsonNode entities = model.path("entities");

        StringBuilder sql = new StringBuilder();

        // Header
        sql.append("-- ============================================================\n");
        sql.append("-- ").append(project).append(" v").append(version)
                .append(" — generado automáticamente desde modelo.json\n");
        sql.append("-- NO editar manualmente — edita modelo.json y reinicia\n");
        sql.append("-- ============================================================\n\n");

        // 2. Generar ENUMs (sin duplicados, en orden)
        Set<String> createdEnums = new LinkedHashSet<>();
        for (JsonNode entity : entities) {
            for (JsonNode field : entity.path("fields")) {
                if ("Enum".equals(field.path("type").asText())) {
                    String enumName = field.path("enumName").asText();
                    if (!enumName.isEmpty() && createdEnums.add(enumName)) {
                        List<String> vals = new ArrayList<>();
                        for (JsonNode v : field.path("values")) {
                            vals.add("'" + v.asText() + "'");
                        }
                        sql.append("CREATE TYPE ").append(enumName)
                                .append(" AS ENUM (").append(String.join(", ", vals)).append(");\n");
                    }
                }
            }
        }
        if (!createdEnums.isEmpty()) sql.append("\n");

        // 3. Generar tablas
        for (JsonNode entity : entities) {
            sql.append(buildTable(entity)).append("\n");
        }

        // 4. Escribir V1__init.sql en db/migration/
        // Busca la carpeta resources en el classpath y sube al filesystem real
        String resourcesPath = new ClassPathResource("").getURI().getPath();
        if (resourcesPath.matches("/[A-Z]:/.*")) {
            resourcesPath = resourcesPath.substring(1);
        }
        Path migrationDir = Paths.get(resourcesPath, "db", "migration");
        Files.createDirectories(migrationDir);

        Path outputFile = migrationDir.resolve("V1__init.sql");

        // Solo genera si no existe (Flyway falla si el archivo cambia después de aplicarse)
        if (Files.exists(outputFile)) {
            System.out.println("  V1__init.sql ya existe — omitiendo generación");
            System.out.println("  (borra el archivo y reinicia para regenerar)");
        } else {
            Files.writeString(outputFile, sql.toString());
            System.out.println("  ✓ Generado: " + outputFile);
        }

        System.out.println("  Entidades: " + entities.size());
        System.out.println("  ENUMs:     " + createdEnums.size());
        System.out.println("========================================\n");
    }
}