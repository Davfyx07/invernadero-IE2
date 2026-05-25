package com.invernadero.cenit.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/system")
public class AdminSystemController {

    @GetMapping("/commits")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> compareCommits() {
        try {
            // El backend se ejecuta desde Cenit/Cenit. Subimos un nivel al raíz del repositorio.
            File workingDir = new File(System.getProperty("user.dir")).getParentFile();
            
            ProcessBuilder pb = new ProcessBuilder("python", "scripts/compare_commits.py");
            pb.directory(workingDir);
            Process p = pb.start();
            
            BufferedReader in = new BufferedReader(new InputStreamReader(p.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = in.readLine()) != null) {
                output.append(line).append("\n");
            }
            
            p.waitFor();
            return ResponseEntity.ok(Map.of("success", true, "output", output.toString()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @PostMapping("/taiga-validate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> validateTaigaCommit(@RequestBody Map<String, String> payload) {
        try {
            String commitMsg = payload.get("commitMessage");
            if (commitMsg == null || commitMsg.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Mensaje vacío"));
            }

            File workingDir = new File(System.getProperty("user.dir")).getParentFile();
            
            ProcessBuilder pb = new ProcessBuilder("python", "scripts/validar_taiga.py", commitMsg);
            pb.directory(workingDir);
            
            // Pasar las variables de entorno actuales al proceso python si es necesario,
            // aunque el script python lee el .env directamente.
            
            Process p = pb.start();
            
            BufferedReader in = new BufferedReader(new InputStreamReader(p.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = in.readLine()) != null) {
                output.append(line).append("\n");
            }
            
            int exitCode = p.waitFor();
            return ResponseEntity.ok(Map.of(
                "success", exitCode == 0,
                "output", output.toString()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("success", false, "error", e.getMessage()));
        }
    }
}
