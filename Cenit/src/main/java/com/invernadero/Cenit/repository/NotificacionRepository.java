package com.invernadero.cenit.repository;

import com.invernadero.cenit.entity.Notificacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {

    @Query("SELECT n FROM Notificacion n WHERE n.usuario_id = :uid ORDER BY n.creadoEn DESC")
    Page<Notificacion> findByUsuario_idOrderByCreadoEnDesc(@Param("uid") Long usuario_id, Pageable pageable);

    @Query("SELECT n FROM Notificacion n WHERE n.usuario_id = :uid AND n.leida = false ORDER BY n.creadoEn DESC")
    List<Notificacion> findTop10ByUsuario_idAndLeidaFalseOrderByCreadoEnDesc(@Param("uid") Long usuario_id);

    @Query("SELECT COUNT(n) FROM Notificacion n WHERE n.usuario_id = :uid AND n.leida = false")
    long countByUsuario_idAndLeidaFalse(@Param("uid") Long usuario_id);
}
