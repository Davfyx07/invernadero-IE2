package com.invernadero.cenit.service;

import com.invernadero.cenit.entity.Usuario;
import com.invernadero.cenit.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Servicio de detalles de usuario para Spring Security.
 * Carga usuarios desde la base de datos por correo electrónico.
 *
 * @author Cenit Team
 * @version 1.0.0
 * @since 2025-05-17
 */
@Service
@RequiredArgsConstructor
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Usuario no encontrado con el correo: " + email));

        return new User(
                usuario.getEmail(),
                usuario.getPassword(),
                usuario.isActivo(),
                true, true, true,
                List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name()))
        );
    }
}
