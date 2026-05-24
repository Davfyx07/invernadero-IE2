package com.invernadero.cenit.service;

import com.invernadero.cenit.entity.Usuario;
import com.invernadero.cenit.enums.Rol;
import com.invernadero.cenit.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class UsuarioServiceTest {

    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private UsuarioService usuarioService;

    @MockBean private EmailService emailService;

    @Test
    void save_conPasswordNull_generaTempPassword() {
        Usuario u = Usuario.builder()
                .nombre("Sin Pass")
                .email("sinpass@cenit.app")
                .password(null)
                .rol(Rol.OPERARIO)
                .activo(true)
                .build();

        Usuario saved = usuarioService.save(u);

        assertNotNull(saved.getPassword());
        assertFalse(saved.getPassword().isBlank());
        assertTrue(saved.isFirstLogin());
        assertTrue(saved.isEmailVerified());
    }

    @Test
    void save_conPasswordVacia_generaTempPassword() {
        Usuario u = Usuario.builder()
                .nombre("Pass Vacia")
                .email("vacia@cenit.app")
                .password("")
                .rol(Rol.OPERARIO)
                .activo(true)
                .build();

        Usuario saved = usuarioService.save(u);

        assertNotNull(saved.getPassword());
        assertFalse(saved.getPassword().isBlank());
    }

    @Test
    void save_conPasswordExistente_preservaPassword() {
        String encoded = passwordEncoder.encode("mypassword");
        Usuario u = Usuario.builder()
                .nombre("Con Pass")
                .email("conpass@cenit.app")
                .password(encoded)
                .rol(Rol.OPERARIO)
                .activo(true)
                .firstLogin(true)
                .build();

        Usuario saved = usuarioService.save(u);

        assertEquals(encoded, saved.getPassword());
        assertTrue(saved.isFirstLogin());
    }

    @Test
    void update_noSobrescribePasswordSiVacio() {
        String encoded = passwordEncoder.encode("original");
        Usuario u = usuarioRepository.save(Usuario.builder()
                .nombre("Original")
                .email("orig@cenit.app")
                .password(encoded)
                .rol(Rol.OPERARIO)
                .activo(true)
                .build());

        Usuario updated = new Usuario();
        updated.setNombre("Actualizado No Pass");
        updated.setEmail("orig@cenit.app");

        usuarioService.update(u.getId(), updated);

        Usuario result = usuarioRepository.findById(u.getId()).orElseThrow();
        assertEquals("Actualizado No Pass", result.getNombre());
        assertEquals(encoded, result.getPassword());
    }

    @Test
    void softDelete_desactivaUsuario() {
        Usuario u = usuarioRepository.save(Usuario.builder()
                .nombre("Activo")
                .email("activo@cenit.app")
                .password("encrypted")
                .rol(Rol.OPERARIO)
                .activo(true)
                .build());

        usuarioService.deleteById(u.getId());

        Usuario after = usuarioRepository.findById(u.getId()).orElseThrow();
        assertFalse(after.isActivo());
    }

    @Test
    void findAll_retornaUsuarios() {
        usuarioRepository.save(Usuario.builder()
                .nombre("A").email("a@cenit.app").password("x").rol(Rol.ADMIN).activo(true).build());
        usuarioRepository.save(Usuario.builder()
                .nombre("B").email("b@cenit.app").password("x").rol(Rol.OPERARIO).activo(true).build());

        Page<Usuario> page = usuarioService.findAll(PageRequest.of(0, 10));

        assertEquals(2, page.getTotalElements());
    }
}
