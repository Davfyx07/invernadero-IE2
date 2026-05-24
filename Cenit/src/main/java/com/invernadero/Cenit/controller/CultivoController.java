package com.invernadero.cenit.controller;

import com.invernadero.cenit.entity.Cultivo;
import com.invernadero.cenit.service.CultivoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/cultivos")
@RequiredArgsConstructor
public class CultivoController {

    private final CultivoService cultivoService;

    @GetMapping
    public ResponseEntity<Page<Cultivo>> findAll(Pageable pageable) {
        return ResponseEntity.ok(cultivoService.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cultivo> findById(@PathVariable Long id) {
        return cultivoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Cultivo> create(@RequestBody Cultivo cultivo) {
        return ResponseEntity.ok(cultivoService.save(cultivo));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Cultivo> update(@PathVariable Long id, @RequestBody Cultivo cultivo) {
        return ResponseEntity.ok(cultivoService.update(id, cultivo));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        cultivoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
