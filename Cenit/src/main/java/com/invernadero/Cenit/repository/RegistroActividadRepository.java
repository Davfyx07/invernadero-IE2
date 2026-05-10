package com.invernadero.cenit.repository;

import com.invernadero.cenit.entity.RegistroActividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Repository
public interface RegistroActividadRepository extends JpaRepository<RegistroActividad, Long> {

    List<RegistroActividad> findByTipoContainingIgnoreCase(String tipo);

}
