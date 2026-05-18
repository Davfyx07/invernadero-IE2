package com.invernadero.cenit.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lecturas_sensores")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LecturaSensor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "zona_id", nullable = false)
    private Long zona_id;

    @Column(nullable = false)
    private Double humedad;

    @Column(nullable = false)
    private Double temperatura;

    @Column(nullable = false)
    private LocalDateTime fechaHora;

    @Builder.Default
    @Column(nullable = false)
    private boolean activo = true;
}
