package com.invernadero.cenit.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entidad para parámetros configurables del sistema.
 * Permite gestionar tipos de insumo, estados de cultivo, etc. sin tocar código.
 *
 * @author Cenit Team
 * @version 1.0.0
 * @since 2025-05-17
 */
@Entity
@Table(name = "parametros")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Parametro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50, nullable = false)
    private String tipo;

    @Column(length = 50, nullable = false)
    private String codigo;

    @Column(length = 100, nullable = false)
    private String nombre;

    @Builder.Default
    @Column(nullable = false)
    private boolean activo = true;
}
