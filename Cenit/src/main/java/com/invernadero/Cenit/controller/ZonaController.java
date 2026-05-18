package com.invernadero.cenit.controller;

import com.invernadero.cenit.entity.Zona;
import com.invernadero.cenit.service.ZonaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/zonas")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ZonaController {

    private final ZonaService zonaService;

    @GetMapping
    public ResponseEntity<Page<Zona>> findAll(Pageable pageable) {
        return ResponseEntity.ok(zonaService.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Zona> findById(@PathVariable Long id) {
        return zonaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Zona> create(@RequestBody Zona zona) {
        return ResponseEntity.ok(zonaService.save(zona));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Zona> update(@PathVariable Long id, @RequestBody Zona zona) {
        return ResponseEntity.ok(zonaService.update(id, zona));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        zonaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
