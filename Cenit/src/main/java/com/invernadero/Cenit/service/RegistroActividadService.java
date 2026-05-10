package com.invernadero.cenit.service;

import com.invernadero.cenit.entity.RegistroActividad;
import com.invernadero.cenit.repository.RegistroActividadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RegistroActividadService {

    private final RegistroActividadRepository registroActividadRepository;

    public Page<RegistroActividad> findAll(Pageable pageable) {
        return registroActividadRepository.findAll(pageable);
    }

    public Optional<RegistroActividad> findById(Long id) {
        return registroActividadRepository.findById(id);
    }

    public RegistroActividad save(RegistroActividad registroActividad) {
        return registroActividadRepository.save(registroActividad);
    }

    public void deleteById(Long id) {
        registroActividadRepository.deleteById(id);
    }

}
