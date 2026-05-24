package com.invernadero.cenit.service;

import com.invernadero.cenit.entity.Cultivo;
import com.invernadero.cenit.entity.RegistroActividad;
import com.invernadero.cenit.entity.Usuario;
import com.invernadero.cenit.repository.CultivoRepository;
import com.invernadero.cenit.repository.RegistroActividadRepository;
import com.invernadero.cenit.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RegistroActividadService {

    private final RegistroActividadRepository registroActividadRepository;
    private final UsuarioRepository usuarioRepository;
    private final CultivoRepository cultivoRepository;
    private final NotificacionService notificacionService;
    private final EmailService emailService;

    public Page<RegistroActividad> findAll(Pageable pageable) {
        return registroActividadRepository.findAll(pageable);
    }

    public Optional<RegistroActividad> findById(Long id) {
        return registroActividadRepository.findById(id);
    }

    public RegistroActividad save(RegistroActividad registroActividad) {
        RegistroActividad saved = registroActividadRepository.save(registroActividad);
        notificarResponsable(saved);
        return saved;
    }

    public RegistroActividad update(Long id, RegistroActividad updated) {
        RegistroActividad existing = registroActividadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND:Registro no encontrado"));
        boolean cambioResponsable = updated.getUsuario_id() != null &&
                !updated.getUsuario_id().equals(existing.getUsuario_id());
        existing.setTipo(updated.getTipo());
        existing.setFecha(updated.getFecha());
        existing.setCantidad(updated.getCantidad());
        existing.setNotas(updated.getNotas());
        existing.setCultivo_id(updated.getCultivo_id());
        existing.setInsumo_id(updated.getInsumo_id());
        existing.setUsuario_id(updated.getUsuario_id());
        existing.setActivo(updated.isActivo());
        RegistroActividad saved = registroActividadRepository.save(existing);
        if (cambioResponsable) {
            notificarResponsable(saved);
        }
        return saved;
    }

    public void deleteById(Long id) {
        registroActividadRepository.findById(id).ifPresent(e -> {
            e.setActivo(false);
            registroActividadRepository.save(e);
        });
    }

    private void notificarResponsable(RegistroActividad registro) {
        if (registro.getUsuario_id() == null) return;
        Optional<Usuario> optUsuario = usuarioRepository.findById(registro.getUsuario_id());
        Optional<Cultivo> optCultivo = cultivoRepository.findById(registro.getCultivo_id());
        if (optUsuario.isPresent()) {
            Usuario u = optUsuario.get();
            String cultivoNombre = optCultivo.map(Cultivo::getEspecie).orElse("Sin cultivo");
            String fechaStr = registro.getFecha() != null ? registro.getFecha().toString() : "Sin fecha";
            notificacionService.crearNotificacion(
                u.getId(),
                "Nueva actividad asignada",
                "Actividad " + registro.getTipo() + " en " + cultivoNombre,
                "ASIGNACION_REGISTRO"
            );
            emailService.sendAsignacionRegistro(
                u.getEmail(),
                u.getNombre(),
                registro.getTipo(),
                cultivoNombre,
                fechaStr
            );
        }
    }
}
