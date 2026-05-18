package com.invernadero.cenit.controller;

import com.invernadero.cenit.entity.LecturaSensor;
import com.invernadero.cenit.service.LecturaSensorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RestController
@RequestMapping("/api/lecturas-sensores")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class LecturaSensorController {

    private final LecturaSensorService lecturaSensorService;

    @GetMapping
    public ResponseEntity<Page<LecturaSensor>> findAll(Pageable pageable) {
        return ResponseEntity.ok(lecturaSensorService.findAll(pageable));
    }

    @GetMapping("/latest")
    public ResponseEntity<List<LecturaSensor>> findLatestByZona() {
        return ResponseEntity.ok(lecturaSensorService.findLatestByZona());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LecturaSensor> findById(@PathVariable Long id) {
        return lecturaSensorService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('OPERARIO')")
    public ResponseEntity<LecturaSensor> create(@RequestBody LecturaSensor lectura) {
        return ResponseEntity.ok(lecturaSensorService.save(lectura));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OPERARIO')")
    public ResponseEntity<LecturaSensor> update(@PathVariable Long id, @RequestBody LecturaSensor lectura) {
        return ResponseEntity.ok(lecturaSensorService.update(id, lectura));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        lecturaSensorService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
