package com.invernadero.cenit.repository;

import com.invernadero.cenit.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    List<Usuario> findByEmailContainingIgnoreCase(String email);

    List<Usuario> findByNombreContainingIgnoreCase(String nombre);

}
