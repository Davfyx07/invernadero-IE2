# Comandos de Pruebas (Tests y Validaciones)

Puedes usar esta hoja como guía (cheat-sheet) para mostrarle a tu profesor que todas las capas del proyecto tienen pruebas y validaciones funcionales desde la terminal.

## 1. Backend (Spring Boot - Java)
Se encarga de ejecutar todas las pruebas unitarias y de integración de la carpeta `src/test/java/`.

```bash
cd Cenit
./mvnw test
```

## 2. Frontend (React - Vitest)
Ejecuta las pruebas unitarias creadas para los componentes usando Vitest y JSdom. 

```bash
cd cenit-web
npx vitest run
```

*Nota: Durante el desarrollo, puedes usar `npx vitest` para estar en modo 'watch' observando cambios.*

## 3. Pruebas E2E (Selenium - Python)
Ejecutan validaciones End-to-End con el navegador, simulando al usuario en distintas áreas de la app.

```bash
# Nota: La app debe estar corriendo (localhost:5173 para el frontend local)
pytest scripts/test_e2e.py
```

## 4. Validar Políticas de Commits (Integración a Taiga)
Evalúa un mensaje de commit a ver si cumple tu política definida en el backend (`[TAG] Mensaje`). Si no es válida, abre una Issue vía API en Taiga.

```bash
# Prueba un caso exitoso:
python scripts/validar_taiga.py "[FIX] Solución a la base de datos"

# Prueba forzar un fallo (Abrirá incidencia en Taiga si tiene el archivo .env o vars correctos)
python scripts/validar_taiga.py "hola mundo esto fallará"
```

## 5. Auditoría: Comparar Commits
Calcula las líneas y los últimos commits organizados por carpetas.

```bash
python scripts/compare_commits.py
```

*Estas dos últimas se revisan desde terminal local con Python y Git; ya no hay panel web para este reporte.*
