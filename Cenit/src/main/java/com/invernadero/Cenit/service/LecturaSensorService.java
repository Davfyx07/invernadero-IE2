package com.invernadero.cenit.service;

import com.invernadero.cenit.entity.LecturaSensor;
import com.invernadero.cenit.repository.LecturaSensorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LecturaSensorService {

    private final LecturaSensorRepository lecturaSensorRepository;

    public Page<LecturaSensor> findAll(Pageable pageable) {
        return lecturaSensorRepository.findAll(pageable);
    }

    public Optional<LecturaSensor> findById(Long id) {
        return lecturaSensorRepository.findById(id);
    }

    public LecturaSensor save(LecturaSensor lectura) {
        if (lectura.getFechaHora() == null) {
            lectura.setFechaHora(LocalDateTime.now());
        }
        return lecturaSensorRepository.save(lectura);
    }

    public LecturaSensor update(Long id, LecturaSensor updated) {
        LecturaSensor existing = lecturaSensorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lectura no encontrada"));
        existing.setZona_id(updated.getZona_id());
        existing.setHumedad(updated.getHumedad());
        existing.setTemperatura(updated.getTemperatura());
        existing.setFechaHora(updated.getFechaHora());
        existing.setActivo(updated.isActivo());
        return lecturaSensorRepository.save(existing);
    }

    public void deleteById(Long id) {
        lecturaSensorRepository.findById(id).ifPresent(e -> {
            e.setActivo(false);
            lecturaSensorRepository.save(e);
        });
    }

    public List<LecturaSensor> findLatestByZona() {
        return lecturaSensorRepository.findLatestByZona();
    }
}
