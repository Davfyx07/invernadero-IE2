package com.invernadero.cenit.repository;

import com.invernadero.cenit.entity.Cultivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface CultivoRepository extends JpaRepository<Cultivo, Long> {

    List<Cultivo> findByEspecieContainingIgnoreCase(String especie);

    List<Cultivo> findByVariedadContainingIgnoreCase(String variedad);

    List<Cultivo> findByEstado(String estado);

    Page<Cultivo> findByActivoTrue(Pageable pageable);

}
