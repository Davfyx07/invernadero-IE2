package com.invernadero.cenit.service;

import com.invernadero.cenit.entity.Cultivo;
import com.invernadero.cenit.entity.Usuario;
import com.invernadero.cenit.entity.Zona;
import com.invernadero.cenit.repository.CultivoRepository;
import com.invernadero.cenit.repository.UsuarioRepository;
import com.invernadero.cenit.repository.ZonaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CultivoService {

    private final CultivoRepository cultivoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ZonaRepository zonaRepository;
    private final NotificacionService notificacionService;
    private final EmailService emailService;

    public Page<Cultivo> findAll(Pageable pageable) {
        return cultivoRepository.findAll(pageable);
    }

    public Optional<Cultivo> findById(Long id) {
        return cultivoRepository.findById(id);
    }

    public Cultivo save(Cultivo cultivo) {
        Cultivo saved = cultivoRepository.save(cultivo);
        notificarResponsable(saved);
        return saved;
    }

    public Cultivo update(Long id, Cultivo updated) {
        Cultivo existing = cultivoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND:Cultivo no encontrado"));
        boolean cambioResponsable = updated.getUsuario_id() != null &&
                !updated.getUsuario_id().equals(existing.getUsuario_id());
        existing.setEspecie(updated.getEspecie());
        existing.setVariedad(updated.getVariedad());
        existing.setEstado(updated.getEstado());
        existing.setFechaSiembra(updated.getFechaSiembra());
        existing.setFechaCosecha(updated.getFechaCosecha());
        existing.setZona_id(updated.getZona_id());
        existing.setUsuario_id(updated.getUsuario_id());
        existing.setActivo(updated.isActivo());
        Cultivo saved = cultivoRepository.save(existing);
        if (cambioResponsable) {
            notificarResponsable(saved);
        }
        return saved;
    }

    public void deleteById(Long id) {
        cultivoRepository.findById(id).ifPresent(e -> {
            e.setActivo(false);
            cultivoRepository.save(e);
        });
    }

    private void notificarResponsable(Cultivo cultivo) {
        if (cultivo.getUsuario_id() == null) return;
        Optional<Usuario> optUsuario = usuarioRepository.findById(cultivo.getUsuario_id());
        Optional<Zona> optZona = zonaRepository.findById(cultivo.getZona_id());
        if (optUsuario.isPresent()) {
            Usuario u = optUsuario.get();
            String zonaNombre = optZona.map(Zona::getNombre).orElse("Sin zona");
            notificacionService.crearNotificacion(
                u.getId(),
                "Nuevo cultivo asignado",
                "Eres responsable de " + cultivo.getEspecie() + " en " + zonaNombre,
                "ASIGNACION_CULTIVO"
            );
            emailService.sendAsignacionCultivo(
                u.getEmail(),
                u.getNombre(),
                cultivo.getEspecie(),
                cultivo.getVariedad(),
                zonaNombre
            );
        }
    }
}
