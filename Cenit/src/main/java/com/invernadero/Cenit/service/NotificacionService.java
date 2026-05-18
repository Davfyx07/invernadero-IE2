package com.invernadero.cenit.service;

import com.invernadero.cenit.entity.Notificacion;
import com.invernadero.cenit.repository.NotificacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;

    public Page<Notificacion> findByUsuario(Long usuario_id, Pageable pageable) {
        return notificacionRepository.findByUsuario_idOrderByCreadoEnDesc(usuario_id, pageable);
    }

    public List<Notificacion> findUnreadByUsuario(Long usuario_id) {
        return notificacionRepository.findTop10ByUsuario_idAndLeidaFalseOrderByCreadoEnDesc(usuario_id);
    }

    public long countUnread(Long usuario_id) {
        return notificacionRepository.countByUsuario_idAndLeidaFalse(usuario_id);
    }

    public Notificacion crearNotificacion(Long usuario_id, String titulo, String mensaje, String tipo) {
        Notificacion n = Notificacion.builder()
                .usuario_id(usuario_id)
                .titulo(titulo)
                .mensaje(mensaje)
                .tipo(tipo)
                .leida(false)
                .build();
        return notificacionRepository.save(n);
    }

    public void marcarComoLeida(Long id) {
        notificacionRepository.findById(id).ifPresent(n -> {
            n.setLeida(true);
            notificacionRepository.save(n);
        });
    }
}
