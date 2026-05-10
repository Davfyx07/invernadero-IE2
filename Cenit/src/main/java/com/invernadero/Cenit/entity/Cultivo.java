package com.invernadero.cenit.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;
import com.invernadero.cenit.enums.Estadocultivo;

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
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Estadocultivo estado;
    @Column(name = "zona_id", nullable = false)
    private Long zona_id;
    @Column(name = "usuario_id", nullable = false)
    private Long usuario_id;

}
