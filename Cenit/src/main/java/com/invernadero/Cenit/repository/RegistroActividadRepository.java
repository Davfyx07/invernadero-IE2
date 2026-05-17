package com.invernadero.cenit.repository;

import com.invernadero.cenit.entity.RegistroActividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RegistroActividadRepository extends JpaRepository<RegistroActividad, Long> {

    List<RegistroActividad> findByTipo(com.invernadero.cenit.enums.Tipoactividad tipo);

}
