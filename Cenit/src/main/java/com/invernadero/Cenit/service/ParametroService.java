package com.invernadero.cenit.service;

import com.invernadero.cenit.entity.Parametro;
import com.invernadero.cenit.repository.ParametroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.Optional;

/**
 * Servicio CRUD de parámetros configurables.
 *
 * @author Cenit Team
 * @version 1.0.0
 * @since 2025-05-17
 */
@Service
@RequiredArgsConstructor
public class ParametroService {

    private final ParametroRepository parametroRepository;

    public Page<Parametro> findAll(Pageable pageable) {
        return parametroRepository.findAll(pageable);
    }

    public Optional<Parametro> findById(Long id) {
        return parametroRepository.findById(id);
    }

    public Parametro save(Parametro parametro) {
        return parametroRepository.save(parametro);
    }

    public Parametro update(Long id, Parametro updated) {
        updated.setId(id);
        return parametroRepository.save(updated);
    }

    public void deleteById(Long id) {
        parametroRepository.findById(id).ifPresent(e -> {
            e.setActivo(false);
            parametroRepository.save(e);
        });
    }
}
