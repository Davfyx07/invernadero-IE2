package com.invernadero.cenit.controller;

import com.invernadero.cenit.entity.Insumo;
import com.invernadero.cenit.service.InsumoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/insumos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class InsumoController {

    private final InsumoService insumoService;

    @GetMapping
    public ResponseEntity<Page<Insumo>> findAll(Pageable pageable) {
        return ResponseEntity.ok(insumoService.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Insumo> findById(@PathVariable Long id) {
        return insumoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Insumo> create(@RequestBody Insumo insumo) {
        return ResponseEntity.ok(insumoService.save(insumo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Insumo> update(@PathVariable Long id, @RequestBody Insumo insumo) {
        return ResponseEntity.ok(insumoService.update(id, insumo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        insumoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
