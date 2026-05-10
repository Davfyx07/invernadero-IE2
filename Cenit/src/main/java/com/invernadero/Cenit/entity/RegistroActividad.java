package com.invernadero.cenit.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;
import com.invernadero.cenit.enums.Tipoactividad;

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
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Tipoactividad tipo;
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

}
