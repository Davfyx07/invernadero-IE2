package com.invernadero.cenit.controller;

import com.invernadero.cenit.entity.RegistroActividad;
import com.invernadero.cenit.service.RegistroActividadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/registroactividads")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class RegistroActividadController {

    private final RegistroActividadService registroActividadService;

    @GetMapping
    public ResponseEntity<Page<RegistroActividad>> findAll(Pageable pageable) {
        return ResponseEntity.ok(registroActividadService.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegistroActividad> findById(@PathVariable Long id) {
        return registroActividadService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<RegistroActividad> create(@RequestBody RegistroActividad registroActividad) {
        return ResponseEntity.ok(registroActividadService.save(registroActividad));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RegistroActividad> update(@PathVariable Long id, @RequestBody RegistroActividad registroActividad) {
        return ResponseEntity.ok(registroActividadService.update(id, registroActividad));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        registroActividadService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
