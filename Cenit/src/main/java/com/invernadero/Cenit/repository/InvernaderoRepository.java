package com.invernadero.cenit.repository;

import com.invernadero.cenit.entity.Invernadero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InvernaderoRepository extends JpaRepository<Invernadero, Long> {

    List<Invernadero> findByNombreContainingIgnoreCase(String nombre);

}
