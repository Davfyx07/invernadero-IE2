package com.invernadero.cenit.config;

import com.invernadero.cenit.entity.*;
import com.invernadero.cenit.enums.Rol;

import com.invernadero.cenit.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Siembra datos de prueba en BD local.
 * Solo se ejecuta con perfil "local" y si las tablas están vacías.
 *
 * @author Cenit Team
 * @version 1.0.0
 * @since 2025-05-17
 */
@Component
@Profile("local")
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final InvernaderoRepository invernaderoRepository;
    private final ZonaRepository zonaRepository;
    private final CultivoRepository cultivoRepository;
    private final InsumoRepository insumoRepository;
    private final RegistroActividadRepository registroActividadRepository;
    private final LecturaSensorRepository lecturaSensorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public void run(String... args) {
        if (usuarioRepository.count() > 0) {
            jdbcTemplate.execute("TRUNCATE TABLE lecturas_sensores, registros_actividad, cultivos, insumos, zonas, invernaderos, usuarios, notificaciones, otp_tokens RESTART IDENTITY CASCADE");
        }

        Usuario admin = usuarioRepository.save(Usuario.builder()
                .nombre("Admin Cenit")
                .email("admin@cenit.app")
                .password(passwordEncoder.encode("admin123"))
                .rol(Rol.ADMIN)
                .activo(true)
                .emailVerified(true)
                .firstLogin(false)
                .creadoEn(LocalDateTime.now())
                .build());

        Usuario op1 = usuarioRepository.save(Usuario.builder()
                .nombre("María López")
                .email("maria@cenit.app")
                .password(passwordEncoder.encode("operario123"))
                .rol(Rol.OPERARIO)
                .activo(true)
                .emailVerified(true)
                .firstLogin(false)
                .creadoEn(LocalDateTime.now())
                .build());

        Usuario op2 = usuarioRepository.save(Usuario.builder()
                .nombre("Carlos Ruiz")
                .email("carlos@cenit.app")
                .password(passwordEncoder.encode("operario123"))
                .rol(Rol.OPERARIO)
                .activo(true)
                .emailVerified(true)
                .firstLogin(false)
                .creadoEn(LocalDateTime.now())
                .build());

        Invernadero inv1 = invernaderoRepository.save(Invernadero.builder()
                .nombre("Invernadero Norte")
                .ubicacion("Sección A, Lote 1")
                .descripcion("Invernadero principal para hortalizas de hoja")
                .creadoEn(LocalDateTime.now())
                .build());

        Invernadero inv2 = invernaderoRepository.save(Invernadero.builder()
                .nombre("Invernadero Sur")
                .ubicacion("Sección B, Lote 3")
                .descripcion("Invernadero para frutales y tomates")
                .creadoEn(LocalDateTime.now())
                .build());

        Invernadero inv3 = invernaderoRepository.save(Invernadero.builder()
                .nombre("Invernadero Experimental")
                .ubicacion("Sección C, Lote 5")
                .descripcion("Zona de pruebas para nuevos cultivos")
                .creadoEn(LocalDateTime.now())
                .build());

        Zona z1 = zonaRepository.save(Zona.builder().nombre("Zona A - Lechugas").capacidad(200).invernadero_id(inv1.getId()).build());
        Zona z2 = zonaRepository.save(Zona.builder().nombre("Zona B - Hierbas").capacidad(150).invernadero_id(inv1.getId()).build());
        Zona z3 = zonaRepository.save(Zona.builder().nombre("Zona C - Tomates").capacidad(180).invernadero_id(inv2.getId()).build());
        Zona z4 = zonaRepository.save(Zona.builder().nombre("Zona D - Pimientos").capacidad(120).invernadero_id(inv2.getId()).build());
        Zona z5 = zonaRepository.save(Zona.builder().nombre("Zona E - Fresas").capacidad(100).invernadero_id(inv3.getId()).build());
        Zona z6 = zonaRepository.save(Zona.builder().nombre("Zona F - Experimental").capacidad(80).invernadero_id(inv3.getId()).build());

        Insumo ins1 = insumoRepository.save(Insumo.builder().nombre("Fertilizante NPK 15-15-15").tipo("FERTILIZANTE").unidadMedida("kg").stockActual(45.0).build());
        Insumo ins2 = insumoRepository.save(Insumo.builder().nombre("Pesticida orgánico").tipo("PESTICIDA").unidadMedida("L").stockActual(8.0).build());
        Insumo ins3 = insumoRepository.save(Insumo.builder().nombre("Sustrato premium").tipo("OTRO").unidadMedida("kg").stockActual(3.0).build());
        Insumo ins4 = insumoRepository.save(Insumo.builder().nombre("Calcio líquido").tipo("FERTILIZANTE").unidadMedida("L").stockActual(2.0).build());

        Cultivo c1 = cultivoRepository.save(Cultivo.builder().especie("Lechuga").variedad("Iceberg").fechaSiembra(LocalDate.of(2025, 3, 1)).estado("ACTIVO").zona_id(z1.getId()).usuario_id(op1.getId()).build());
        Cultivo c2 = cultivoRepository.save(Cultivo.builder().especie("Tomate").variedad("Roma").fechaSiembra(LocalDate.of(2025, 2, 10)).estado("ACTIVO").zona_id(z3.getId()).usuario_id(op1.getId()).build());
        Cultivo c3 = cultivoRepository.save(Cultivo.builder().especie("Pimiento").variedad("California").fechaSiembra(LocalDate.of(2024, 11, 20)).estado("COSECHADO").zona_id(z4.getId()).usuario_id(op2.getId()).build());
        Cultivo c4 = cultivoRepository.save(Cultivo.builder().especie("Fresa").variedad("Albion").fechaSiembra(LocalDate.of(2025, 1, 25)).estado("ACTIVO").zona_id(z5.getId()).usuario_id(op1.getId()).build());
        Cultivo c5 = cultivoRepository.save(Cultivo.builder().especie("Cilantro").variedad("Slow Bolt").fechaSiembra(LocalDate.of(2025, 3, 1)).estado("ACTIVO").zona_id(z2.getId()).usuario_id(op1.getId()).build());
        Cultivo c6 = cultivoRepository.save(Cultivo.builder().especie("Espinaca").variedad("Bloomsdale").fechaSiembra(LocalDate.of(2025, 1, 15)).estado("PERDIDO").zona_id(z6.getId()).usuario_id(op2.getId()).build());

        registroActividadRepository.save(RegistroActividad.builder().tipo("RIEGO").fecha(LocalDateTime.now().minusDays(1)).cantidad(15.5).notas("Riego matutino").cultivo_id(c1.getId()).insumo_id(null).usuario_id(op1.getId()).build());
        registroActividadRepository.save(RegistroActividad.builder().tipo("FERTILIZACION").fecha(LocalDateTime.now().minusDays(1)).cantidad(2.0).notas("Aplicación NPK").cultivo_id(c2.getId()).insumo_id(ins1.getId()).usuario_id(op1.getId()).build());
        registroActividadRepository.save(RegistroActividad.builder().tipo("INSPECCION").fecha(LocalDateTime.now().minusDays(2)).cantidad(0.0).notas("Revisión general de plagas").cultivo_id(c1.getId()).insumo_id(null).usuario_id(op1.getId()).build());
        registroActividadRepository.save(RegistroActividad.builder().tipo("FUMIGACION").fecha(LocalDateTime.now().minusDays(3)).cantidad(1.2).notas("Control de ácaros").cultivo_id(c4.getId()).insumo_id(ins2.getId()).usuario_id(op2.getId()).build());
        registroActividadRepository.save(RegistroActividad.builder().tipo("RIEGO").fecha(LocalDateTime.now().minusDays(3)).cantidad(12.0).notas("Riego vespertino").cultivo_id(c4.getId()).insumo_id(null).usuario_id(op1.getId()).build());
        registroActividadRepository.save(RegistroActividad.builder().tipo("FERTILIZACION").fecha(LocalDateTime.now().minusDays(4)).cantidad(1.5).notas("Micronutrientes").cultivo_id(c2.getId()).insumo_id(ins4.getId()).usuario_id(op1.getId()).build());
        registroActividadRepository.save(RegistroActividad.builder().tipo("RIEGO").fecha(LocalDateTime.now().minusDays(4)).cantidad(18.0).notas("Riego profundo").cultivo_id(c1.getId()).insumo_id(null).usuario_id(op2.getId()).build());
        registroActividadRepository.save(RegistroActividad.builder().tipo("OTRO").fecha(LocalDateTime.now().minusDays(5)).cantidad(0.5).notas("Aplicación de calcio foliar").cultivo_id(c3.getId()).insumo_id(ins4.getId()).usuario_id(op1.getId()).build());

        // Lecturas de sensores (última por zona)
        lecturaSensorRepository.save(LecturaSensor.builder().zona_id(z1.getId()).humedad(78.0).temperatura(22.4).fechaHora(LocalDateTime.now().minusHours(2)).build());
        lecturaSensorRepository.save(LecturaSensor.builder().zona_id(z2.getId()).humedad(65.0).temperatura(24.1).fechaHora(LocalDateTime.now().minusHours(3)).build());
        lecturaSensorRepository.save(LecturaSensor.builder().zona_id(z3.getId()).humedad(82.0).temperatura(21.8).fechaHora(LocalDateTime.now().minusHours(1)).build());
        lecturaSensorRepository.save(LecturaSensor.builder().zona_id(z4.getId()).humedad(70.0).temperatura(23.5).fechaHora(LocalDateTime.now().minusHours(4)).build());
        lecturaSensorRepository.save(LecturaSensor.builder().zona_id(z5.getId()).humedad(60.0).temperatura(25.2).fechaHora(LocalDateTime.now().minusHours(2)).build());
        lecturaSensorRepository.save(LecturaSensor.builder().zona_id(z6.getId()).humedad(75.0).temperatura(22.0).fechaHora(LocalDateTime.now().minusHours(5)).build());
    }
}
