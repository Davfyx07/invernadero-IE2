package com.invernadero.cenit.repository;

import com.invernadero.cenit.entity.Cultivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Repository
public interface CultivoRepository extends JpaRepository<Cultivo, Long> {

    List<Cultivo> findByEspecieContainingIgnoreCase(String especie);

    List<Cultivo> findByVariedadContainingIgnoreCase(String variedad);

    List<Cultivo> findByEstadoContainingIgnoreCase(String estado);

}
