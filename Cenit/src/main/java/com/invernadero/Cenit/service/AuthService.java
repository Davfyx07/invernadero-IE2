package com.invernadero.cenit.service;

import com.invernadero.cenit.config.JwtConfig;
import com.invernadero.cenit.dto.AuthRequest;
import com.invernadero.cenit.dto.AuthResponse;
import com.invernadero.cenit.dto.RegisterRequest;
import com.invernadero.cenit.entity.Usuario;
import com.invernadero.cenit.enums.Rol;
import com.invernadero.cenit.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtConfig jwtConfig;
    private final OtpService otpService;
    private final EmailService emailService;

    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("El correo ya está registrado");
        }

        String nombreCompleto = request.getNombre();
        if (request.getApellido() != null && !request.getApellido().isBlank()) {
            nombreCompleto += " " + request.getApellido();
        }

        Usuario usuario = Usuario.builder()
                .nombre(nombreCompleto)
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .rol(Rol.OPERARIO)
                .activo(true)
                .emailVerified(false)
                .firstLogin(false)
                .creadoEn(LocalDateTime.now())
                .build();

        usuarioRepository.save(usuario);

        // Enviar OTP de verificación
        otpService.sendOtp(usuario.getEmail(), "EMAIL_VERIFICATION", "verificar tu correo");

        String token = jwtConfig.generateToken(usuario.getEmail());
        usuario.setPassword(null);
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .usuario(usuario)
                .requiresVerification(true)
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        if (!usuario.isActivo()) {
            throw new RuntimeException("Usuario inactivo");
        }

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        String token = jwtConfig.generateToken(usuario.getEmail());
        usuario.setPassword(null);

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .usuario(usuario)
                .requiresPasswordChange(usuario.isFirstLogin())
                .build();
    }

    public AuthResponse loginOrRegisterOAuth(String email, String nombre) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseGet(() -> {
                    Usuario nuevo = Usuario.builder()
                            .nombre(nombre)
                            .email(email)
                            .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                            .rol(Rol.OPERARIO)
                            .activo(true)
                            .emailVerified(true)
                            .firstLogin(false)
                            .creadoEn(LocalDateTime.now())
                            .build();
                    return usuarioRepository.save(nuevo);
                });

        String token = jwtConfig.generateToken(usuario.getEmail());
        usuario.setPassword(null);

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .usuario(usuario)
                .build();
    }

    public void verifyEmail(String email, String code) {
        boolean ok = otpService.verifyOtp(email, code, "EMAIL_VERIFICATION");
        if (!ok) throw new RuntimeException("Código inválido o expirado");
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setEmailVerified(true);
        usuarioRepository.save(usuario);
    }

    public void resendVerificationOtp(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        otpService.sendOtp(usuario.getEmail(), "EMAIL_VERIFICATION", "verificar tu correo");
    }

    public void forgotPassword(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Correo no registrado"));
        if (!usuario.isActivo()) throw new RuntimeException("Usuario inactivo");
        otpService.sendOtp(email, "PASSWORD_RECOVERY", "recuperar tu contraseña");
    }

    public void resetPassword(String email, String code, String newPassword) {
        boolean ok = otpService.verifyOtp(email, code, "PASSWORD_RECOVERY");
        if (!ok) throw new RuntimeException("Código inválido o expirado");
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setPassword(passwordEncoder.encode(newPassword));
        usuario.setFirstLogin(false);
        usuarioRepository.save(usuario);
    }

    public void changePassword(String email, String currentPassword, String newPassword) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (!passwordEncoder.matches(currentPassword, usuario.getPassword())) {
            throw new RuntimeException("Contraseña actual incorrecta");
        }
        usuario.setPassword(passwordEncoder.encode(newPassword));
        usuario.setFirstLogin(false);
        usuarioRepository.save(usuario);
    }

    public String generateTempPassword(Usuario usuario) {
        String temp = UUID.randomUUID().toString().substring(0, 10);
        usuario.setPassword(passwordEncoder.encode(temp));
        usuario.setFirstLogin(true);
        usuario.setEmailVerified(true);
        usuarioRepository.save(usuario);
        emailService.sendTempPassword(usuario.getEmail(), temp);
        return temp;
    }
}
