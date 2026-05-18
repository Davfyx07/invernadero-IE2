package com.invernadero.cenit.repository;

import com.invernadero.cenit.entity.LecturaSensor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LecturaSensorRepository extends JpaRepository<LecturaSensor, Long> {

    @Query(value = """
        SELECT DISTINCT ON (zona_id) *
        FROM lecturas_sensores
        WHERE activo = true
        ORDER BY zona_id, fecha_hora DESC
        """, nativeQuery = true)
    List<LecturaSensor> findLatestByZona();
}
