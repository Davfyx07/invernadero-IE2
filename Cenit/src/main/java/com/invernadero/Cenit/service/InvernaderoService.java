package com.invernadero.cenit.service;

import com.invernadero.cenit.entity.Invernadero;
import com.invernadero.cenit.repository.InvernaderoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InvernaderoService {

    private final InvernaderoRepository invernaderoRepository;

    public Page<Invernadero> findAll(Pageable pageable) {
        return invernaderoRepository.findAll(pageable);
    }

    public Optional<Invernadero> findById(Long id) {
        return invernaderoRepository.findById(id);
    }

    public Invernadero save(Invernadero invernadero) {
        return invernaderoRepository.save(invernadero);
    }

    public Invernadero update(Long id, Invernadero updated) {
        Invernadero existing = invernaderoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invernadero no encontrado"));
        existing.setNombre(updated.getNombre());
        existing.setUbicacion(updated.getUbicacion());
        existing.setDescripcion(updated.getDescripcion());
        existing.setActivo(updated.isActivo());
        return invernaderoRepository.save(existing);
    }

    public void deleteById(Long id) {
        invernaderoRepository.findById(id).ifPresent(e -> {
            e.setActivo(false);
            invernaderoRepository.save(e);
        });
    }

}
