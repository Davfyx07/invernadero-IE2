package com.invernadero.cenit.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;

@Entity
@Table(name = "cultivos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cultivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 100, nullable = false)
    private String especie;
    @Column(length = 100)
    private String variedad;
    @Column(nullable = false)
    private LocalDate fechaSiembra;
    private LocalDate fechaCosecha;
    @Column(length = 50, nullable = false)
    private String estado;
    @Column(name = "zona_id", nullable = false)
    private Long zona_id;
    @Column(name = "usuario_id", nullable = false)
    private Long usuario_id;
    @Builder.Default
    @Column(nullable = false)
    private boolean activo = true;

}
