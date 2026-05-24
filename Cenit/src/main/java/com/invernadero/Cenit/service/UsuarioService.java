package com.invernadero.cenit.service;

import com.invernadero.cenit.entity.Usuario;
import com.invernadero.cenit.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public Page<Usuario> findAll(Pageable pageable) {
        return usuarioRepository.findAll(pageable);
    }

    public Optional<Usuario> findById(Long id) {
        return usuarioRepository.findById(id);
    }

    public Usuario save(Usuario usuario) {
        // Si no tiene password, generar temporal ANTES de guardar
        if (usuario.getPassword() == null || usuario.getPassword().isBlank()) {
            String temp = UUID.randomUUID().toString().substring(0, 10);
            usuario.setPassword(passwordEncoder.encode(temp));
            usuario.setFirstLogin(true);
            usuario.setEmailVerified(true);
            usuario = usuarioRepository.save(usuario);
            emailService.sendTempPassword(usuario.getEmail(), temp);
            return usuario;
        }
        return usuarioRepository.save(usuario);
    }

    public Usuario update(Long id, Usuario updated) {
        Usuario existing = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND:Usuario no encontrado"));

        if (updated.getNombre() != null) existing.setNombre(updated.getNombre());
        if (updated.getEmail() != null) existing.setEmail(updated.getEmail());
        if (updated.getRol() != null) existing.setRol(updated.getRol());
        if (updated.getPassword() != null && !updated.getPassword().isBlank()) {
            existing.setPassword(updated.getPassword());
        }
        // activo se actualiza explícitamente (requerido para soft delete toggles)
        existing.setActivo(updated.isActivo());

        return usuarioRepository.save(existing);
    }

    public void deleteById(Long id) {
        usuarioRepository.findById(id).ifPresent(e -> {
            e.setActivo(false);
            usuarioRepository.save(e);
        });
    }

}
