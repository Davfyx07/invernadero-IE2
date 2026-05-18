package com.invernadero.cenit.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notificaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id", nullable = false)
    private Long usuario_id;

    @Column(length = 100, nullable = false)
    private String titulo;

    @Column(length = 500, nullable = false)
    private String mensaje;

    @Column(length = 30)
    private String tipo; // ASIGNACION_CULTIVO, ASIGNACION_REGISTRO, SISTEMA

    @Builder.Default
    @Column(nullable = false)
    private boolean leida = false;

    @Column(nullable = false)
    private LocalDateTime creadoEn;

    @PrePersist
    public void prePersist() {
        if (this.creadoEn == null) {
            this.creadoEn = LocalDateTime.now();
        }
    }
}
