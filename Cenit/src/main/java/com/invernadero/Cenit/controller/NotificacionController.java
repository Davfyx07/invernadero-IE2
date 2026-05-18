package com.invernadero.cenit.controller;

import com.invernadero.cenit.entity.Notificacion;
import com.invernadero.cenit.entity.Usuario;
import com.invernadero.cenit.repository.UsuarioRepository;
import com.invernadero.cenit.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class NotificacionController {

    private final NotificacionService notificacionService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<Page<Notificacion>> findAll(
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable) {
        return ResponseEntity.ok(notificacionService.findByUsuario(obtenerUsuarioId(userDetails), pageable));
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Notificacion>> findUnread(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(notificacionService.findUnreadByUsuario(obtenerUsuarioId(userDetails)));
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countUnread(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(notificacionService.countUnread(obtenerUsuarioId(userDetails)));
    }

    @PutMapping("/{id}/leer")
    public ResponseEntity<Void> marcarLeida(@PathVariable Long id) {
        notificacionService.marcarComoLeida(id);
        return ResponseEntity.ok().build();
    }

    private Long obtenerUsuarioId(UserDetails userDetails) {
        Usuario usuario = usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return usuario.getId();
    }
}
