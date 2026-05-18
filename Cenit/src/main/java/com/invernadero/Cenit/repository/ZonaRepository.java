package com.invernadero.cenit.repository;

import com.invernadero.cenit.entity.Zona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface ZonaRepository extends JpaRepository<Zona, Long> {

    List<Zona> findByNombreContainingIgnoreCase(String nombre);

    Page<Zona> findByActivoTrue(Pageable pageable);

}
