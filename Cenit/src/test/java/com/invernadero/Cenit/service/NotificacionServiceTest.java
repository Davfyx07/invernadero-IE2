package com.invernadero.cenit.service;

import com.invernadero.cenit.entity.Notificacion;
import com.invernadero.cenit.repository.NotificacionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class NotificacionServiceTest {

    @Autowired private NotificacionRepository notificacionRepository;
    @Autowired private NotificacionService notificacionService;
    @Autowired private JdbcTemplate jdbcTemplate;

    @BeforeEach
    void clean() {
        jdbcTemplate.execute("DELETE FROM notificaciones");
    }

    @Test
    void crearNotificacion_guardaCorrectamente() {
        Notificacion n = notificacionService.crearNotificacion(
                1L, "Título", "Mensaje de prueba", "SISTEMA");

        assertNotNull(n.getId());
        assertEquals("Título", n.getTitulo());
        assertEquals("Mensaje de prueba", n.getMensaje());
        assertEquals("SISTEMA", n.getTipo());
        assertFalse(n.isLeida());
        assertNotNull(n.getCreadoEn());
    }

    @Test
    void findByUsuario_retornaPorUsuario() {
        notificacionService.crearNotificacion(1L, "T1", "M1", "SISTEMA");
        notificacionService.crearNotificacion(1L, "T2", "M2", "SISTEMA");
        notificacionService.crearNotificacion(2L, "T3", "M3", "SISTEMA");

        Page<Notificacion> page = notificacionService.findByUsuario(1L, PageRequest.of(0, 10));
        assertEquals(2, page.getTotalElements());
    }

    @Test
    void findUnreadByUsuario_retornaSoloNoLeidas() {
        Notificacion n1 = notificacionService.crearNotificacion(1L, "No leída", "M1", "SISTEMA");
        Notificacion n2 = notificacionService.crearNotificacion(1L, "T2", "M2", "SISTEMA");

        notificacionRepository.findById(n2.getId()).ifPresent(n -> {
            n.setLeida(true);
            notificacionRepository.save(n);
        });

        List<Notificacion> unread = notificacionService.findUnreadByUsuario(1L);
        assertEquals(1, unread.size());
        assertEquals("No leída", unread.get(0).getTitulo());
    }

    @Test
    void countUnread_cuentaCorrectamente() {
        notificacionService.crearNotificacion(1L, "T1", "M1", "SISTEMA");
        notificacionService.crearNotificacion(1L, "T2", "M2", "SISTEMA");
        notificacionService.crearNotificacion(1L, "T3", "M3", "SISTEMA");

        long count = notificacionService.countUnread(1L);
        assertEquals(3, count);
    }

    @Test
    void marcarComoLeida_cambiaEstado() {
        Notificacion n = notificacionService.crearNotificacion(1L, "Test", "Mensaje", "SISTEMA");

        notificacionService.marcarComoLeida(n.getId());

        Notificacion updated = notificacionRepository.findById(n.getId()).orElseThrow();
        assertTrue(updated.isLeida());
    }

    @Test
    void marcarComoLeida_idNoExiste_noLanzaError() {
        assertDoesNotThrow(() -> notificacionService.marcarComoLeida(999L));
    }

    @Test
    void countUnread_sinNotificaciones_retornaCero() {
        long count = notificacionService.countUnread(42L);
        assertEquals(0, count);
    }

    @Test
    void findByUsuario_orderByCreadoEnDesc() {
        notificacionService.crearNotificacion(1L, "Más antigua", "M1", "SISTEMA");

        Page<Notificacion> page = notificacionService.findByUsuario(1L, PageRequest.of(0, 5));
        assertEquals(1, page.getTotalElements());
        assertEquals("Más antigua", page.getContent().get(0).getTitulo());
    }
}
