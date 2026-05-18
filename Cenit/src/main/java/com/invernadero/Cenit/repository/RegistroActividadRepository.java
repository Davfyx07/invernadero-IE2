package com.invernadero.cenit.repository;

import com.invernadero.cenit.entity.RegistroActividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface RegistroActividadRepository extends JpaRepository<RegistroActividad, Long> {

    List<RegistroActividad> findByTipo(String tipo);

    Page<RegistroActividad> findByActivoTrue(Pageable pageable);

}
