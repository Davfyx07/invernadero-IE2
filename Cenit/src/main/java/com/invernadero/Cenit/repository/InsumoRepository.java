package com.invernadero.cenit.repository;

import com.invernadero.cenit.entity.Insumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InsumoRepository extends JpaRepository<Insumo, Long> {

    List<Insumo> findByNombreContainingIgnoreCase(String nombre);

    List<Insumo> findByTipo(com.invernadero.cenit.enums.Tipoinsumo tipo);

}
