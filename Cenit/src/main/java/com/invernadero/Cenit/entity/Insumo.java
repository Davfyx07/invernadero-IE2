package com.invernadero.cenit.entity;

import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "insumos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Insumo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 100, nullable = false)
    private String nombre;
    @Column(length = 50, nullable = false)
    private String tipo;
    @Column(length = 20, nullable = false)
    private String unidadMedida;
    @Column(nullable = false)
    private Double stockActual;
    @Builder.Default
    @Column(nullable = false)
    private boolean activo = true;

}
