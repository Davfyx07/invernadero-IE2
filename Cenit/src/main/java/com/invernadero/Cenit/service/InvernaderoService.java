package com.invernadero.cenit.service;

import com.invernadero.cenit.entity.Invernadero;
import com.invernadero.cenit.repository.InvernaderoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
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
        updated.setId(id);
        return invernaderoRepository.save(updated);
    }

    public void deleteById(Long id) {
        invernaderoRepository.deleteById(id);
    }

}
