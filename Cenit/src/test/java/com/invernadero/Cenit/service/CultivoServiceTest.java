package com.invernadero.cenit.service;

import java.time.LocalDate;
import java.time.LocalDateTime;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

import com.invernadero.cenit.entity.Cultivo;
import com.invernadero.cenit.entity.Usuario;
import com.invernadero.cenit.entity.Zona;
import com.invernadero.cenit.enums.Rol;
import com.invernadero.cenit.repository.CultivoRepository;
import com.invernadero.cenit.repository.NotificacionRepository;
import com.invernadero.cenit.repository.UsuarioRepository;
import com.invernadero.cenit.repository.ZonaRepository;
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
class CultivoServiceTest {

    @Autowired private CultivoRepository cultivoRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private ZonaRepository zonaRepository;
    @Autowired private NotificacionRepository notificacionRepository;
    @Autowired private CultivoService cultivoService;
    @Autowired private JdbcTemplate jdbcTemplate;

    @MockBean private EmailService emailService;

    @BeforeEach
    void clean() {
        jdbcTemplate.execute("DELETE FROM notificaciones");
        jdbcTemplate.execute("DELETE FROM cultivos");
        jdbcTemplate.execute("DELETE FROM zonas");
        jdbcTemplate.execute("DELETE FROM usuarios");
    }

    private Usuario seedUsuario(Long id, String email) {
        Usuario u = Usuario.builder()
                .id(id)
                .nombre("User " + email)
                .email(email)
                .password("encrypted")
                .rol(Rol.OPERARIO)
                .activo(true)
                .emailVerified(true)
                .build();
        return usuarioRepository.save(u);
    }

    private Zona seedZona(Long id, String nombre, Long invernaderoId) {
        Zona z = Zona.builder()
                .id(id)
                .nombre(nombre)
                .capacidad(100)
                .invernadero_id(invernaderoId)
                .activo(true)
                .build();
        return zonaRepository.save(z);
    }

    @Test
    void save_guardaCultivoCorrectamente() {
        Usuario u = seedUsuario(null, "resp@cenit.app");
        Zona z = seedZona(null, "Zona A", 1L);

        Cultivo c = Cultivo.builder()
                .especie("Tomate")
                .variedad("Cherry")
                .fechaSiembra(LocalDate.of(2026, 1, 15))
                .estado("CRECIMIENTO")
                .zona_id(z.getId())
                .usuario_id(u.getId())
                .activo(true)
                .build();

        Cultivo saved = cultivoService.save(c);

        assertNotNull(saved.getId());
        assertEquals("Tomate", saved.getEspecie());
        assertEquals("CRECIMIENTO", saved.getEstado());
        assertEquals(LocalDate.of(2026, 1, 15), saved.getFechaSiembra());
        assertEquals(u.getId(), saved.getUsuario_id());
    }

    @Test
    void findAll_retornaTodosLosCultivos() {
        Usuario u = seedUsuario(null, "resp@cenit.app");
        Zona z = seedZona(null, "Zona A", 1L);

        cultivoService.save(Cultivo.builder()
                .especie("Tomate").fechaSiembra(LocalDate.now()).estado("CRECIMIENTO")
                .zona_id(z.getId()).usuario_id(u.getId()).activo(true).build());
        cultivoService.save(Cultivo.builder()
                .especie("Lechuga").fechaSiembra(LocalDate.now()).estado("CRECIMIENTO")
                .zona_id(z.getId()).usuario_id(u.getId()).activo(true).build());

        Page<Cultivo> page = cultivoService.findAll(PageRequest.of(0, 10));
        assertEquals(2, page.getTotalElements());
    }

    @Test
    void findById_encuentraCultivoExistente() {
        Usuario u = seedUsuario(null, "resp@cenit.app");
        Zona z = seedZona(null, "Zona A", 1L);

        Cultivo c = cultivoService.save(Cultivo.builder()
                .especie("Tomate").fechaSiembra(LocalDate.now()).estado("CRECIMIENTO")
                .zona_id(z.getId()).usuario_id(u.getId()).activo(true).build());

        Optional<Cultivo> found = cultivoService.findById(c.getId());
        assertTrue(found.isPresent());
        assertEquals("Tomate", found.get().getEspecie());
    }

    @Test
    void update_actualizaCamposCorrectamente() {
        Usuario u = seedUsuario(null, "resp@cenit.app");
        Zona z = seedZona(null, "Zona A", 1L);

        Cultivo c = cultivoService.save(Cultivo.builder()
                .especie("Tomate").variedad("Cherry").fechaSiembra(LocalDate.now())
                .estado("CRECIMIENTO").zona_id(z.getId()).usuario_id(u.getId())
                .activo(true).build());

        Cultivo updated = new Cultivo();
        updated.setEspecie("Tomate Actualizado");
        updated.setVariedad("Raf");
        updated.setEstado("COSECHA");
        updated.setFechaSiembra(LocalDate.of(2026, 3, 1));
        updated.setFechaCosecha(LocalDate.of(2026, 6, 1));
        updated.setZona_id(z.getId());
        updated.setUsuario_id(u.getId());
        updated.setActivo(true);

        Cultivo result = cultivoService.update(c.getId(), updated);

        assertEquals("Tomate Actualizado", result.getEspecie());
        assertEquals("Raf", result.getVariedad());
        assertEquals("COSECHA", result.getEstado());
    }

    @Test
    void update_idNoExiste_lanzaNotFound() {
        Cultivo updated = new Cultivo();
        updated.setEspecie("X");
        updated.setFechaSiembra(LocalDate.now());
        updated.setEstado("ESTADO");
        updated.setZona_id(1L);
        updated.setUsuario_id(1L);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> cultivoService.update(999L, updated));
        assertTrue(ex.getMessage().startsWith("NOT_FOUND:"));
    }

    @Test
    void softDelete_desactivaCultivo() {
        Usuario u = seedUsuario(null, "resp@cenit.app");
        Zona z = seedZona(null, "Zona A", 1L);

        Cultivo c = cultivoService.save(Cultivo.builder()
                .especie("Tomate").fechaSiembra(LocalDate.now()).estado("CRECIMIENTO")
                .zona_id(z.getId()).usuario_id(u.getId()).activo(true).build());

        cultivoService.deleteById(c.getId());

        Cultivo after = cultivoRepository.findById(c.getId()).orElseThrow();
        assertFalse(after.isActivo());
    }

    @Test
    void save_generaNotificacionDeAsignacion() {
        Usuario u = seedUsuario(null, "resp@cenit.app");
        Zona z = seedZona(null, "Zona A", 1L);

        cultivoService.save(Cultivo.builder()
                .especie("Tomate").variedad("Cherry").fechaSiembra(LocalDate.now())
                .estado("CRECIMIENTO").zona_id(z.getId()).usuario_id(u.getId())
                .activo(true).build());

        long count = notificacionRepository.countByUsuario_idAndLeidaFalse(u.getId());
        assertTrue(count > 0, "Debe existir al menos una notificación");
    }
}
