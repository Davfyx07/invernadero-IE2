package com.invernadero.cenit.controller;

import com.invernadero.cenit.entity.Invernadero;
import com.invernadero.cenit.service.InvernaderoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/invernaderos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class InvernaderoController {

    private final InvernaderoService invernaderoService;

    @GetMapping
    public ResponseEntity<Page<Invernadero>> findAll(Pageable pageable) {
        return ResponseEntity.ok(invernaderoService.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invernadero> findById(@PathVariable Long id) {
        return invernaderoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Invernadero> create(@RequestBody Invernadero invernadero) {
        return ResponseEntity.ok(invernaderoService.save(invernadero));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Invernadero> update(@PathVariable Long id, @RequestBody Invernadero invernadero) {
        return ResponseEntity.ok(invernaderoService.update(id, invernadero));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        invernaderoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
