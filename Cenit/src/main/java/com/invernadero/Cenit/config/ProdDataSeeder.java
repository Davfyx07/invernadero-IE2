package com.invernadero.cenit.config;

import com.invernadero.cenit.entity.Usuario;
import com.invernadero.cenit.enums.Rol;
import com.invernadero.cenit.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Crea el usuario administrador inicial en produccion.
 * Solo se ejecuta con perfil "prod" y unicamente si la tabla usuarios esta vacia.
 * (NO trunca nada — seguro para entornos reales.)
 *
 * @author Cenit Team
 * @version 1.0.0
 * @since 2026-05-23
 */
@Slf4j
@Component
@Profile("prod")
@RequiredArgsConstructor
public class ProdDataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:admin@cenit.app}")
    private String adminEmail;

    @Value("${app.admin.password:#{null}}")
    private String adminPassword;

    @Override
    @Transactional
    public void run(String... args) {
        if (usuarioRepository.count() > 0) {
            log.info("ProdDataSeeder: la BD ya tiene {} usuarios. Omitiendo seed.", usuarioRepository.count());
            return;
        }

        String password = (adminPassword != null && !adminPassword.isBlank())
                ? adminPassword
                : "Cambiame123!";

        Usuario admin = Usuario.builder()
                .nombre("Administrador")
                .email(adminEmail)
                .password(passwordEncoder.encode(password))
                .rol(Rol.ADMIN)
                .activo(true)
                .emailVerified(true)
                .firstLogin(false)
                .creadoEn(LocalDateTime.now())
                .build();

        usuarioRepository.save(admin);
        log.info("ProdDataSeeder: admin creado exitosamente ({})", adminEmail);

        if (adminPassword == null || adminPassword.isBlank()) {
            log.warn("ATENCION: Se uso la password por defecto. Configura ADMIN_PASSWORD en .env inmediatamente.");
        }
    }
}
