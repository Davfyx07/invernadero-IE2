package com.invernadero.cenit.controller;

import com.invernadero.cenit.entity.Parametro;
import com.invernadero.cenit.repository.ParametroRepository;
import com.invernadero.cenit.service.ParametroService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST de parámetros configurables.
 * GET /api/parametros?tipo=TIPO_INSUMO → lista filtrada.
 *
 * @author Cenit Team
 * @version 1.0.0
 * @since 2025-05-17
 */
@RestController
@RequestMapping("/api/parametros")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ParametroController {

    private final ParametroService parametroService;
    private final ParametroRepository parametroRepository;

    @GetMapping
    public ResponseEntity<Page<Parametro>> findAll(
            @RequestParam(required = false) String tipo,
            Pageable pageable) {
        if (tipo != null && !tipo.isEmpty()) {
            List<Parametro> list = parametroRepository.findByTipo(tipo);
            return ResponseEntity.ok(new org.springframework.data.domain.PageImpl<>(list, pageable, list.size()));
        }
        return ResponseEntity.ok(parametroService.findAll(pageable));
    }

    @GetMapping("/by-tipo")
    public ResponseEntity<List<Parametro>> findByTipo(@RequestParam String tipo) {
        return ResponseEntity.ok(parametroRepository.findByTipo(tipo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Parametro> findById(@PathVariable Long id) {
        return parametroService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Parametro> create(@RequestBody Parametro parametro) {
        return ResponseEntity.ok(parametroService.save(parametro));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Parametro> update(@PathVariable Long id, @RequestBody Parametro parametro) {
        return ResponseEntity.ok(parametroService.update(id, parametro));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        parametroService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
