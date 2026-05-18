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
        // No permitir sobrescribir password desde update genérico
        if (updated.getPassword() == null || updated.getPassword().isBlank()) {
            usuarioRepository.findById(id).ifPresent(existing -> {
                updated.setPassword(existing.getPassword());
            });
        }
        updated.setId(id);
        return usuarioRepository.save(updated);
    }

    public void deleteById(Long id) {
        usuarioRepository.findById(id).ifPresent(e -> {
            e.setActivo(false);
            usuarioRepository.save(e);
        });
    }

}
