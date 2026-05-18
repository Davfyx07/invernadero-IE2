package com.invernadero.cenit.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;
@Entity
@Table(name = "registros_actividad")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistroActividad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String tipo;
    @Column(nullable = false)
    private LocalDateTime fecha;
    private Double cantidad;
    private String notas;
    @Column(name = "cultivo_id", nullable = false)
    private Long cultivo_id;
    @Column(name = "insumo_id")
    private Long insumo_id;
    @Column(name = "usuario_id", nullable = false)
    private Long usuario_id;
    @Builder.Default
    @Column(nullable = false)
    private boolean activo = true;

}
