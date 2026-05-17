package com.invernadero.cenit.tools;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

/**
 * BackendGenerator
 *
 * Lee modelo.json + backend.json y genera automáticamente:
 *   - Entity (JPA)
 *   - Repository (Spring Data)
 *   - Service
 *   - Controller (REST)
 *
 * Corre al arrancar Spring Boot. Si los archivos ya existen, los omite.
 * Para regenerar: borra la carpeta generada y reinicia.
 */
// @Component
// @Order(2)
public class BackendGenerator implements ApplicationRunner {

    private static final String BASE_OUTPUT = "src/main/java";

    // ─── Mapeo tipo JSON → tipo Java ─────────────────────────────────────────
    private String toJavaType(JsonNode field) {
        String type = field.path("type").asText();
        return switch (type) {
            case "Long"     -> "Long";
            case "String"   -> "String";
            case "Boolean"  -> "Boolean";
            case "Integer"  -> "Integer";
            case "Double"   -> "Double";
            case "Date"     -> "LocalDate";
            case "DateTime" -> "LocalDateTime";
            case "Text"     -> "String";
            case "Enum"     -> capitalize(field.path("enumName").asText()
                    .replace("_enum", "").replace("_", ""));
            case "FK"       -> "Long";
            default         -> "String";
        };
    }

    private String capitalize(String s) {
        if (s == null || s.isEmpty()) return s;
        return Character.toUpperCase(s.charAt(0)) + s.substring(1);
    }

    private String toSnake(String name) {
        return name.replaceAll("([A-Z])", "_$1").toLowerCase().replaceAll("^_", "");
    }

    // ─── Busca entidad en modelo.json por nombre ──────────────────────────────
    private JsonNode findEntity(JsonNode model, String name) {
        for (JsonNode e : model.path("entities")) {
            if (e.path("name").asText().equals(name)) return e;
        }
        return null;
    }

    // ─── Genera el enum Java si hay campos tipo Enum ──────────────────────────
    private void generateEnum(JsonNode field, Path enumDir, String pkg) throws IOException {
        String enumName = field.path("enumName").asText();
        String className = capitalize(enumName.replace("_enum", "").replace("_", ""));
        Path file = enumDir.resolve(className + ".java");
        if (Files.exists(file)) return;

        List<String> values = new ArrayList<>();
        for (JsonNode v : field.path("values")) values.add(v.asText());

        StringBuilder sb = new StringBuilder();
        sb.append("package ").append(pkg).append(".enums;\n\n");
        sb.append("public enum ").append(className).append(" {\n");
        sb.append("    ").append(String.join(", ", values)).append("\n");
        sb.append("}\n");

        Files.createDirectories(enumDir);
        Files.writeString(file, sb.toString());
        System.out.println("  [enum]       " + className + ".java");
    }

    // ─── Genera Entity JPA ────────────────────────────────────────────────────
    private void generateEntity(JsonNode entity, JsonNode model, Path entityDir, String pkg) throws IOException {
        String name = entity.path("name").asText();
        String table = entity.path("table").asText();
        Path file = entityDir.resolve(name + ".java");
        if (Files.exists(file)) return;

        Set<String> imports = new LinkedHashSet<>();
        imports.add("jakarta.persistence.*");
        imports.add("lombok.*");

        List<String> fields = new ArrayList<>();
        Set<String> enumsUsed = new LinkedHashSet<>();

        for (JsonNode f : entity.path("fields")) {
            String fname = f.path("name").asText();
            String ftype = f.path("type").asText();
            boolean pk = f.path("pk").asBoolean(false);
            boolean nullable = f.path("nullable").asBoolean(true);

            if ("DateTime".equals(ftype) || "Date".equals(ftype)) {
                imports.add("java.time.*");
            }

            if (pk) {
                fields.add("    @Id");
                fields.add("    @GeneratedValue(strategy = GenerationType.IDENTITY)");
                fields.add("    private Long id;");
                continue;
            }

            if ("FK".equals(ftype)) {
                // FK → solo guarda el id, sin @ManyToOne para mantenerlo simple
                String colName = toSnake(fname);
                fields.add("    @Column(name = \"" + colName + "\"" + (nullable ? "" : ", nullable = false") + ")");
                fields.add("    private Long " + fname + ";");
                continue;
            }

            if ("Enum".equals(ftype)) {
                String enumClass = capitalize(f.path("enumName").asText()
                        .replace("_enum", "").replace("_", ""));
                enumsUsed.add(enumClass);
                fields.add("    @Enumerated(EnumType.STRING)");
                if (!nullable) fields.add("    @Column(nullable = false)");
                fields.add("    private " + enumClass + " " + fname + ";");
                continue;
            }

            String javaType = toJavaType(f);
            StringBuilder colAnn = new StringBuilder("    @Column(");
            List<String> colProps = new ArrayList<>();
            if (f.has("maxLength")) colProps.add("length = " + f.path("maxLength").asInt());
            if (!nullable) colProps.add("nullable = false");
            if (f.path("unique").asBoolean(false)) colProps.add("unique = true");
            colAnn.append(String.join(", ", colProps)).append(")");
            if (!colProps.isEmpty()) fields.add(colAnn.toString());
            fields.add("    private " + javaType + " " + fname + ";");
        }

        StringBuilder sb = new StringBuilder();
        sb.append("package ").append(pkg).append(".entity;\n\n");

        for (String imp : imports) sb.append("import ").append(imp).append(";\n");
        for (String en : enumsUsed) sb.append("import ").append(pkg).append(".enums.").append(en).append(";\n");

        sb.append("\n@Entity\n");
        sb.append("@Table(name = \"").append(table).append("\")\n");
        sb.append("@Data\n@NoArgsConstructor\n@AllArgsConstructor\n@Builder\n");
        sb.append("public class ").append(name).append(" {\n\n");
        sb.append(String.join("\n", fields)).append("\n\n}\n");

        Files.createDirectories(entityDir);
        Files.writeString(file, sb.toString());
        System.out.println("  [entity]     " + name + ".java");
    }

    // ─── Genera Repository ────────────────────────────────────────────────────
    private void generateRepository(String name, List<String> searchBy,
                                    JsonNode entity, Path repoDir, String pkg) throws IOException {
        Path file = repoDir.resolve(name + "Repository.java");
        if (Files.exists(file)) return;

        StringBuilder sb = new StringBuilder();
        sb.append("package ").append(pkg).append(".repository;\n\n");
        sb.append("import ").append(pkg).append(".entity.").append(name).append(";\n");
        sb.append("import org.springframework.data.jpa.repository.JpaRepository;\n");
        sb.append("import org.springframework.stereotype.Repository;\n");
        if (!searchBy.isEmpty()) {
            sb.append("import org.springframework.data.domain.Page;\n");
            sb.append("import org.springframework.data.domain.Pageable;\n");
            sb.append("import java.util.List;\n");
        }
        sb.append("\n@Repository\n");
        sb.append("public interface ").append(name).append("Repository");
        sb.append(" extends JpaRepository<").append(name).append(", Long> {\n\n");

        // Genera métodos de búsqueda por campo
        for (String field : searchBy) {
            String method = "findBy" + capitalize(field) + "ContainingIgnoreCase";
            sb.append("    List<").append(name).append("> ")
                    .append(method).append("(String ").append(field).append(");\n\n");
        }

        sb.append("}\n");

        Files.createDirectories(repoDir);
        Files.writeString(file, sb.toString());
        System.out.println("  [repository] " + name + "Repository.java");
    }

    // ─── Genera Service ───────────────────────────────────────────────────────
    private void generateService(String name, List<String> endpoints,
                                 boolean pagination, Path serviceDir, String pkg) throws IOException {
        Path file = serviceDir.resolve(name + "Service.java");
        if (Files.exists(file)) return;

        String repo = Character.toLowerCase(name.charAt(0)) + name.substring(1) + "Repository";
        String entity = name;
        String varName = Character.toLowerCase(name.charAt(0)) + name.substring(1);

        StringBuilder sb = new StringBuilder();
        sb.append("package ").append(pkg).append(".service;\n\n");
        sb.append("import ").append(pkg).append(".entity.").append(entity).append(";\n");
        sb.append("import ").append(pkg).append(".repository.").append(name).append("Repository;\n");
        sb.append("import lombok.RequiredArgsConstructor;\n");
        sb.append("import org.springframework.stereotype.Service;\n");
        if (pagination) {
            sb.append("import org.springframework.data.domain.Page;\n");
            sb.append("import org.springframework.data.domain.Pageable;\n");
        }
        sb.append("import java.util.List;\n");
        sb.append("import java.util.Optional;\n\n");

        sb.append("@Service\n@RequiredArgsConstructor\n");
        sb.append("public class ").append(name).append("Service {\n\n");
        sb.append("    private final ").append(name).append("Repository ").append(repo).append(";\n\n");

        if (endpoints.contains("GET_ALL")) {
            if (pagination) {
                sb.append("    public Page<").append(entity).append("> findAll(Pageable pageable) {\n");
                sb.append("        return ").append(repo).append(".findAll(pageable);\n    }\n\n");
            } else {
                sb.append("    public List<").append(entity).append("> findAll() {\n");
                sb.append("        return ").append(repo).append(".findAll();\n    }\n\n");
            }
        }
        if (endpoints.contains("GET_BY_ID")) {
            sb.append("    public Optional<").append(entity).append("> findById(Long id) {\n");
            sb.append("        return ").append(repo).append(".findById(id);\n    }\n\n");
        }
        if (endpoints.contains("CREATE")) {
            sb.append("    public ").append(entity).append(" save(").append(entity).append(" ").append(varName).append(") {\n");
            sb.append("        return ").append(repo).append(".save(").append(varName).append(");\n    }\n\n");
        }
        if (endpoints.contains("UPDATE")) {
            sb.append("    public ").append(entity).append(" update(Long id, ").append(entity).append(" updated) {\n");
            sb.append("        updated.setId(id);\n");
            sb.append("        return ").append(repo).append(".save(updated);\n    }\n\n");
        }
        if (endpoints.contains("DELETE")) {
            sb.append("    public void deleteById(Long id) {\n");
            sb.append("        ").append(repo).append(".deleteById(id);\n    }\n\n");
        }

        sb.append("}\n");

        Files.createDirectories(serviceDir);
        Files.writeString(file, sb.toString());
        System.out.println("  [service]    " + name + "Service.java");
    }

    // ─── Genera Controller REST ───────────────────────────────────────────────
    private void generateController(String name, List<String> endpoints,
                                    boolean pagination, Path controllerDir, String pkg) throws IOException {
        Path file = controllerDir.resolve(name + "Controller.java");
        if (Files.exists(file)) return;

        String service = Character.toLowerCase(name.charAt(0)) + name.substring(1) + "Service";
        String varName = Character.toLowerCase(name.charAt(0)) + name.substring(1);
        String route = "/api/" + toSnake(name).replace("_", "-") + "s";

        StringBuilder sb = new StringBuilder();
        sb.append("package ").append(pkg).append(".controller;\n\n");
        sb.append("import ").append(pkg).append(".entity.").append(name).append(";\n");
        sb.append("import ").append(pkg).append(".service.").append(name).append("Service;\n");
        sb.append("import lombok.RequiredArgsConstructor;\n");
        sb.append("import org.springframework.http.ResponseEntity;\n");
        sb.append("import org.springframework.web.bind.annotation.*;\n");
        if (pagination) {
            sb.append("import org.springframework.data.domain.Page;\n");
            sb.append("import org.springframework.data.domain.Pageable;\n");
        }
        sb.append("import java.util.List;\n\n");

        sb.append("@RestController\n");
        sb.append("@RequestMapping(\"").append(route).append("\")\n");
        sb.append("@RequiredArgsConstructor\n");
        sb.append("@CrossOrigin(origins = \"http://localhost:5173\")\n");
        sb.append("public class ").append(name).append("Controller {\n\n");
        sb.append("    private final ").append(name).append("Service ").append(service).append(";\n\n");

        if (endpoints.contains("GET_ALL")) {
            if (pagination) {
                sb.append("    @GetMapping\n");
                sb.append("    public ResponseEntity<Page<").append(name).append(">> findAll(Pageable pageable) {\n");
                sb.append("        return ResponseEntity.ok(").append(service).append(".findAll(pageable));\n    }\n\n");
            } else {
                sb.append("    @GetMapping\n");
                sb.append("    public ResponseEntity<List<").append(name).append(">> findAll() {\n");
                sb.append("        return ResponseEntity.ok(").append(service).append(".findAll());\n    }\n\n");
            }
        }
        if (endpoints.contains("GET_BY_ID")) {
            sb.append("    @GetMapping(\"/{id}\")\n");
            sb.append("    public ResponseEntity<").append(name).append("> findById(@PathVariable Long id) {\n");
            sb.append("        return ").append(service).append(".findById(id)\n");
            sb.append("                .map(ResponseEntity::ok)\n");
            sb.append("                .orElse(ResponseEntity.notFound().build());\n    }\n\n");
        }
        if (endpoints.contains("CREATE")) {
            sb.append("    @PostMapping\n");
            sb.append("    public ResponseEntity<").append(name).append("> create(@RequestBody ").append(name).append(" ").append(varName).append(") {\n");
            sb.append("        return ResponseEntity.ok(").append(service).append(".save(").append(varName).append("));\n    }\n\n");
        }
        if (endpoints.contains("UPDATE")) {
            sb.append("    @PutMapping(\"/{id}\")\n");
            sb.append("    public ResponseEntity<").append(name).append("> update(@PathVariable Long id, @RequestBody ").append(name).append(" ").append(varName).append(") {\n");
            sb.append("        return ResponseEntity.ok(").append(service).append(".update(id, ").append(varName).append("));\n    }\n\n");
        }
        if (endpoints.contains("DELETE")) {
            sb.append("    @DeleteMapping(\"/{id}\")\n");
            sb.append("    public ResponseEntity<Void> delete(@PathVariable Long id) {\n");
            sb.append("        ").append(service).append(".deleteById(id);\n");
            sb.append("        return ResponseEntity.noContent().build();\n    }\n\n");
        }

        sb.append("}\n");

        Files.createDirectories(controllerDir);
        Files.writeString(file, sb.toString());
        System.out.println("  [controller] " + name + "Controller.java");
    }

    // ─── Punto de entrada ─────────────────────────────────────────────────────
    @Override
    public void run(ApplicationArguments args) throws Exception {

        System.out.println("\n========================================");
        System.out.println("  BackendGenerator — leyendo JSONs");
        System.out.println("========================================");

        ObjectMapper mapper = new ObjectMapper();

        // Leer modelo.json
        InputStream modelIs = new ClassPathResource("modelo.json").getInputStream();
        JsonNode model = mapper.readTree(modelIs);

        // Leer backend.json
        InputStream backendIs = new ClassPathResource("backend.json").getInputStream();
        JsonNode backend = mapper.readTree(backendIs);

        String pkg = backend.path("package").asText();
        String pkgPath = pkg.replace(".", "/");

        // Rutas de salida dentro del proyecto
        Path base        = Paths.get(BASE_OUTPUT, pkgPath);
        Path entityDir   = base.resolve("entity");
        Path enumDir     = base.resolve("enums");
        Path repoDir     = base.resolve("repository");
        Path serviceDir  = base.resolve("service");
        Path controllerDir = base.resolve("controller");

        int generated = 0;

        for (JsonNode entityConfig : backend.path("entities")) {
            String name = entityConfig.path("name").asText();
            boolean pagination = entityConfig.path("pagination").asBoolean(false);

            List<String> endpoints = new ArrayList<>();
            for (JsonNode ep : entityConfig.path("endpoints")) endpoints.add(ep.asText());

            List<String> searchBy = new ArrayList<>();
            for (JsonNode s : entityConfig.path("searchBy")) searchBy.add(s.asText());

            // Busca la entidad en modelo.json
            JsonNode entityNode = findEntity(model, name);
            if (entityNode == null) {
                System.out.println("  [WARN] Entidad '" + name + "' no encontrada en modelo.json");
                continue;
            }

            System.out.println("\n  → " + name);

            // Genera ENUMs de esta entidad
            for (JsonNode f : entityNode.path("fields")) {
                if ("Enum".equals(f.path("type").asText())) {
                    generateEnum(f, enumDir, pkg);
                }
            }

            generateEntity(entityNode, model, entityDir, pkg);
            generateRepository(name, searchBy, entityNode, repoDir, pkg);
            generateService(name, endpoints, pagination, serviceDir, pkg);
            generateController(name, endpoints, pagination, controllerDir, pkg);
            generated++;
        }

        System.out.println("\n========================================");
        System.out.println("  ✓ " + generated + " entidades generadas");
        System.out.println("  Carpetas:");
        System.out.println("    " + entityDir);
        System.out.println("    " + repoDir);
        System.out.println("    " + serviceDir);
        System.out.println("    " + controllerDir);
        System.out.println("========================================\n");
    }
}