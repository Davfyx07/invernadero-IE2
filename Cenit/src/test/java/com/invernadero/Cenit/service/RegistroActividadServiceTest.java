package com.invernadero.cenit.service;

import java.time.LocalDate;
import java.time.LocalDateTime;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

import com.invernadero.cenit.entity.Cultivo;
import com.invernadero.cenit.entity.RegistroActividad;
import com.invernadero.cenit.entity.Usuario;
import com.invernadero.cenit.enums.Rol;
import com.invernadero.cenit.repository.CultivoRepository;
import com.invernadero.cenit.repository.NotificacionRepository;
import com.invernadero.cenit.repository.RegistroActividadRepository;
import com.invernadero.cenit.repository.UsuarioRepository;
import com.invernadero.cenit.taiga.TaigaTestWatcher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@ExtendWith(TaigaTestWatcher.class)
class RegistroActividadServiceTest {

    @Autowired private RegistroActividadRepository registroActividadRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private CultivoRepository cultivoRepository;
    @Autowired private NotificacionRepository notificacionRepository;
    @Autowired private RegistroActividadService registroActividadService;
    @Autowired private JdbcTemplate jdbcTemplate;

    @MockBean private EmailService emailService;

    @BeforeEach
    void clean() {
        jdbcTemplate.execute("DELETE FROM notificaciones");
        jdbcTemplate.execute("DELETE FROM registros_actividad");
        jdbcTemplate.execute("DELETE FROM cultivos");
        jdbcTemplate.execute("DELETE FROM zonas");
        jdbcTemplate.execute("DELETE FROM usuarios");
    }

    private Usuario seedUsuario() {
        return usuarioRepository.save(Usuario.builder()
                .nombre("Test").email("test@cenit.app").password("x")
                .rol(Rol.OPERARIO).activo(true).emailVerified(true).build());
    }

    private Cultivo seedCultivo(Long zonaId, Long usuarioId) {
        return cultivoRepository.save(Cultivo.builder()
                .especie("Lechuga").fechaSiembra(LocalDate.now()).estado("CRECIMIENTO")
                .zona_id(zonaId).usuario_id(usuarioId).activo(true).build());
    }

    @Test
    void save_guardaRegistroCorrectamente() {
        Usuario u = seedUsuario();
        Cultivo c = seedCultivo(1L, u.getId());

        RegistroActividad r = RegistroActividad.builder()
                .tipo("RIEGO")
                .fecha(LocalDateTime.now())
                .cantidad(15.0)
                .notas("Riego manual")
                .cultivo_id(c.getId())
                .usuario_id(u.getId())
                .activo(true)
                .build();

        RegistroActividad saved = registroActividadService.save(r);

        assertNotNull(saved.getId());
        assertEquals("RIEGO", saved.getTipo());
        assertEquals(15.0, saved.getCantidad());
        assertEquals(c.getId(), saved.getCultivo_id());
    }

    @Test
    void findAll_retornaRegistros() {
        Usuario u = seedUsuario();
        Cultivo c = seedCultivo(1L, u.getId());

        registroActividadService.save(RegistroActividad.builder()
                .tipo("RIEGO").fecha(LocalDateTime.now()).cultivo_id(c.getId())
                .usuario_id(u.getId()).activo(true).build());
        registroActividadService.save(RegistroActividad.builder()
                .tipo("FERTILIZACION").fecha(LocalDateTime.now()).cultivo_id(c.getId())
                .usuario_id(u.getId()).activo(true).build());

        Page<RegistroActividad> page = registroActividadService.findAll(PageRequest.of(0, 10));
        assertEquals(2, page.getTotalElements());
    }

    @Test
    void findById_encuentraRegistro() {
        Usuario u = seedUsuario();
        Cultivo c = seedCultivo(1L, u.getId());

        RegistroActividad r = registroActividadService.save(RegistroActividad.builder()
                .tipo("RIEGO").fecha(LocalDateTime.now()).cultivo_id(c.getId())
                .usuario_id(u.getId()).activo(true).build());

        Optional<RegistroActividad> found = registroActividadService.findById(r.getId());
        assertTrue(found.isPresent());
        assertEquals("RIEGO", found.get().getTipo());
    }

    @Test
    void update_actualizaCampos() {
        Usuario u = seedUsuario();
        Cultivo c = seedCultivo(1L, u.getId());

        RegistroActividad r = registroActividadService.save(RegistroActividad.builder()
                .tipo("RIEGO").fecha(LocalDateTime.now()).cantidad(10.0)
                .cultivo_id(c.getId()).usuario_id(u.getId()).activo(true).build());

        RegistroActividad updated = new RegistroActividad();
        updated.setTipo("FERTILIZACION");
        updated.setFecha(LocalDateTime.of(2026, 5, 1, 10, 0));
        updated.setCantidad(25.0);
        updated.setNotas("Fertilización NPK");
        updated.setCultivo_id(c.getId());
        updated.setUsuario_id(u.getId());
        updated.setActivo(true);

        RegistroActividad result = registroActividadService.update(r.getId(), updated);

        assertEquals("FERTILIZACION", result.getTipo());
        assertEquals(25.0, result.getCantidad());
        assertEquals("Fertilización NPK", result.getNotas());
    }

    @Test
    void update_idNoExiste_lanzaNotFound() {
        RegistroActividad updated = new RegistroActividad();
        updated.setTipo("X");
        updated.setFecha(LocalDateTime.now());
        updated.setCultivo_id(1L);
        updated.setUsuario_id(1L);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> registroActividadService.update(999L, updated));
        assertTrue(ex.getMessage().startsWith("NOT_FOUND:"));
    }

    @Test
    void softDelete_desactivaRegistro() {
        Usuario u = seedUsuario();
        Cultivo c = seedCultivo(1L, u.getId());

        RegistroActividad r = registroActividadService.save(RegistroActividad.builder()
                .tipo("RIEGO").fecha(LocalDateTime.now()).cultivo_id(c.getId())
                .usuario_id(u.getId()).activo(true).build());

        registroActividadService.deleteById(r.getId());

        RegistroActividad after = registroActividadRepository.findById(r.getId()).orElseThrow();
        assertFalse(after.isActivo());
    }

    @Test
    void save_generaNotificacionDeAsignacion() {
        Usuario u = seedUsuario();
        Cultivo c = seedCultivo(1L, u.getId());

        registroActividadService.save(RegistroActividad.builder()
                .tipo("RIEGO").fecha(LocalDateTime.now()).cultivo_id(c.getId())
                .usuario_id(u.getId()).activo(true).build());

        long count = notificacionRepository.countByUsuario_idAndLeidaFalse(u.getId());
        assertTrue(count > 0, "Debe existir al menos una notificación");
    }
}
