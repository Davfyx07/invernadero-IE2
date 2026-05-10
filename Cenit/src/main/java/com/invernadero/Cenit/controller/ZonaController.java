package com.invernadero.cenit.controller;

import com.invernadero.cenit.entity.Zona;
import com.invernadero.cenit.service.ZonaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/zonas")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ZonaController {

    private final ZonaService zonaService;

    @GetMapping
    public ResponseEntity<List<Zona>> findAll() {
        return ResponseEntity.ok(zonaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Zona> findById(@PathVariable Long id) {
        return zonaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Zona> create(@RequestBody Zona zona) {
        return ResponseEntity.ok(zonaService.save(zona));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Zona> update(@PathVariable Long id, @RequestBody Zona zona) {
        return ResponseEntity.ok(zonaService.update(id, zona));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        zonaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
