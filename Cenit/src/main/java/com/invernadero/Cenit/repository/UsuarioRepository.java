package com.invernadero.cenit.repository;

import com.invernadero.cenit.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    List<Usuario> findByEmailContainingIgnoreCase(String email);

    List<Usuario> findByNombreContainingIgnoreCase(String nombre);

    Page<Usuario> findByActivoTrue(Pageable pageable);

}
