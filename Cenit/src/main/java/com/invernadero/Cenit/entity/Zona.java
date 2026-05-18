package com.invernadero.cenit.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "zonas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Zona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 100, nullable = false)
    private String nombre;
    private Integer capacidad;
    @Column(name = "invernadero_id", nullable = false)
    private Long invernadero_id;
    @Builder.Default
    @Column(nullable = false)
    private boolean activo = true;

}
