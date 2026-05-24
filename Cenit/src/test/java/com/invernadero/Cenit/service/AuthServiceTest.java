package com.invernadero.cenit.service;

import com.invernadero.cenit.config.JwtConfig;
import com.invernadero.cenit.dto.AuthRequest;
import com.invernadero.cenit.dto.AuthResponse;
import com.invernadero.cenit.dto.RegisterRequest;
import com.invernadero.cenit.entity.Usuario;
import com.invernadero.cenit.enums.Rol;
import com.invernadero.cenit.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class AuthServiceTest {

    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtConfig jwtConfig;
    @Autowired private AuthService authService;
    @Autowired private JdbcTemplate jdbcTemplate;

    @MockBean private OtpService otpService;
    @MockBean private EmailService emailService;

    @BeforeEach
    void clean() {
        jdbcTemplate.execute("DELETE FROM usuarios");
    }

    private Usuario seedUser(String email, String rawPassword, boolean activo) {
        Usuario u = Usuario.builder()
                .nombre("Test User")
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .rol(Rol.OPERARIO)
                .activo(activo)
                .emailVerified(true)
                .firstLogin(false)
                .build();
        return usuarioRepository.save(u);
    }

    @Test
    void login_conCredencialesCorrectas_retornaToken() {
        seedUser("test@cenit.app", "mypassword", true);

        AuthRequest req = new AuthRequest();
        req.setEmail("test@cenit.app");
        req.setPassword("mypassword");

        AuthResponse res = authService.login(req);

        assertNotNull(res.getToken());
        assertEquals("Bearer", res.getType());
        assertNotNull(res.getUsuario());
        assertEquals("test@cenit.app", res.getUsuario().getEmail());
        assertNull(res.getUsuario().getPassword());
        assertFalse(res.isRequiresPasswordChange());
    }

    @Test
    void login_emailNoExiste_lanzaEmailNotFound() {
        AuthRequest req = new AuthRequest();
        req.setEmail("nada@cenit.app");
        req.setPassword("cualquiera");

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.login(req));
        assertTrue(ex.getMessage().startsWith("EMAIL_NOT_FOUND:"));
    }

    @Test
    void login_passwordIncorrecta_lanzaInvalidCredentials() {
        seedUser("test@cenit.app", "mypassword", true);

        AuthRequest req = new AuthRequest();
        req.setEmail("test@cenit.app");
        req.setPassword("wrongpassword");

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.login(req));
        assertTrue(ex.getMessage().startsWith("INVALID_CREDENTIALS:"));
    }

    @Test
    void login_usuarioInactivo_lanzaUserInactive() {
        seedUser("test@cenit.app", "mypassword", false);

        AuthRequest req = new AuthRequest();
        req.setEmail("test@cenit.app");
        req.setPassword("mypassword");

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.login(req));
        assertTrue(ex.getMessage().startsWith("USER_INACTIVE:"));
    }

    @Test
    void login_tokenEsValido() {
        seedUser("test@cenit.app", "mypassword", true);

        AuthRequest req = new AuthRequest();
        req.setEmail("test@cenit.app");
        req.setPassword("mypassword");

        AuthResponse res = authService.login(req);

        assertTrue(jwtConfig.isTokenValid(res.getToken()));
        assertEquals("test@cenit.app", jwtConfig.extractEmail(res.getToken()));
    }

    @Test
    void login_marcaRequiresPasswordChange_siFirstLogin() {
        Usuario u = seedUser("test@cenit.app", "mypassword", true);
        u.setFirstLogin(true);
        usuarioRepository.save(u);

        AuthRequest req = new AuthRequest();
        req.setEmail("test@cenit.app");
        req.setPassword("mypassword");

        AuthResponse res = authService.login(req);
        assertTrue(res.isRequiresPasswordChange());
    }

    @Test
    void register_creaUsuarioYEnviaOtp() {
        RegisterRequest req = new RegisterRequest();
        req.setNombre("Juan");
        req.setApellido("Lozano");
        req.setEmail("juan@cenit.app");
        req.setPassword("secure123");

        AuthResponse res = authService.register(req);

        assertNotNull(res.getToken());
        assertEquals("Juan Lozano", res.getUsuario().getNombre());
        assertEquals(Rol.OPERARIO, res.getUsuario().getRol());
        assertFalse(res.getUsuario().isEmailVerified());
        assertTrue(res.isRequiresVerification());

        assertTrue(usuarioRepository.findByEmail("juan@cenit.app").isPresent());
    }

    @Test
    void register_emailDuplicado_lanzaDuplicateEmail() {
        seedUser("dup@cenit.app", "pass123", true);

        RegisterRequest req = new RegisterRequest();
        req.setNombre("Ana");
        req.setApellido("Perez");
        req.setEmail("dup@cenit.app");
        req.setPassword("secure123");

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.register(req));
        assertTrue(ex.getMessage().startsWith("DUPLICATE_EMAIL:"));
    }

    @Test
    void changePassword_conContraseñaActualCorrecta_actualiza() {
        Usuario u = seedUser("test@cenit.app", "currentPass", true);

        authService.changePassword("test@cenit.app", "currentPass", "newPass456");

        Usuario updated = usuarioRepository.findByEmail("test@cenit.app").orElseThrow();
        assertTrue(passwordEncoder.matches("newPass456", updated.getPassword()));
        assertFalse(updated.isFirstLogin());
    }

    @Test
    void changePassword_conContraseñaActualIncorrecta_lanzaWrongPassword() {
        seedUser("test@cenit.app", "currentPass", true);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.changePassword("test@cenit.app", "badPass", "newPass"));
        assertTrue(ex.getMessage().startsWith("WRONG_PASSWORD:"));
    }

    @Test
    void forgotPassword_emailNoExiste_lanzaEmailNotFound() {
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.forgotPassword("nunca@cenit.app"));
        assertTrue(ex.getMessage().startsWith("EMAIL_NOT_FOUND:"));
    }
}
