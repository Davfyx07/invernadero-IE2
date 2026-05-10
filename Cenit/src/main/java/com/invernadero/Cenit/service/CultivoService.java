package com.invernadero.cenit.service;

import com.invernadero.cenit.entity.Cultivo;
import com.invernadero.cenit.repository.CultivoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CultivoService {

    private final CultivoRepository cultivoRepository;

    public Page<Cultivo> findAll(Pageable pageable) {
        return cultivoRepository.findAll(pageable);
    }

    public Optional<Cultivo> findById(Long id) {
        return cultivoRepository.findById(id);
    }

    public Cultivo save(Cultivo cultivo) {
        return cultivoRepository.save(cultivo);
    }

    public Cultivo update(Long id, Cultivo updated) {
        updated.setId(id);
        return cultivoRepository.save(updated);
    }

    public void deleteById(Long id) {
        cultivoRepository.deleteById(id);
    }

}
