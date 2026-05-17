package com.invernadero.cenit.service;

import com.invernadero.cenit.entity.Insumo;
import com.invernadero.cenit.repository.InsumoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InsumoService {

    private final InsumoRepository insumoRepository;

    public Page<Insumo> findAll(Pageable pageable) {
        return insumoRepository.findAll(pageable);
    }

    public Optional<Insumo> findById(Long id) {
        return insumoRepository.findById(id);
    }

    public Insumo save(Insumo insumo) {
        return insumoRepository.save(insumo);
    }

    public Insumo update(Long id, Insumo updated) {
        updated.setId(id);
        return insumoRepository.save(updated);
    }

    public void deleteById(Long id) {
        insumoRepository.deleteById(id);
    }

}
