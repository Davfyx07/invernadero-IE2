package com.invernadero.cenit.repository;

import com.invernadero.cenit.entity.Parametro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Repositorio de parámetros configurables.
 *
 * @author Cenit Team
 * @version 1.0.0
 * @since 2025-05-17
 */
@Repository
public interface ParametroRepository extends JpaRepository<Parametro, Long> {

    List<Parametro> findByTipoAndActivoTrue(String tipo);

    List<Parametro> findByTipo(String tipo);

    boolean existsByTipoAndCodigo(String tipo, String codigo);

    Page<Parametro> findByActivoTrue(Pageable pageable);
}
