package com.invernadero.cenit.repository;

import com.invernadero.cenit.entity.Invernadero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface InvernaderoRepository extends JpaRepository<Invernadero, Long> {

    List<Invernadero> findByNombreContainingIgnoreCase(String nombre);

    Page<Invernadero> findByActivoTrue(Pageable pageable);

}
