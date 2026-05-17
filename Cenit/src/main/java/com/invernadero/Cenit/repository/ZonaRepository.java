package com.invernadero.cenit.repository;

import com.invernadero.cenit.entity.Zona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ZonaRepository extends JpaRepository<Zona, Long> {

    List<Zona> findByNombreContainingIgnoreCase(String nombre);

}
