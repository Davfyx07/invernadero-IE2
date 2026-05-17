package com.invernadero.cenit.service;

import com.invernadero.cenit.entity.Zona;
import com.invernadero.cenit.repository.ZonaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ZonaService {

    private final ZonaRepository zonaRepository;

    public Page<Zona> findAll(Pageable pageable) {
        return zonaRepository.findAll(pageable);
    }

    public Optional<Zona> findById(Long id) {
        return zonaRepository.findById(id);
    }

    public Zona save(Zona zona) {
        return zonaRepository.save(zona);
    }

    public Zona update(Long id, Zona updated) {
        updated.setId(id);
        return zonaRepository.save(updated);
    }

    public void deleteById(Long id) {
        zonaRepository.deleteById(id);
    }

}
