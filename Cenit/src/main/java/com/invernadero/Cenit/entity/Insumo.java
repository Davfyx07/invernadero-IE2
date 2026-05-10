package com.invernadero.cenit.entity;

import jakarta.persistence.*;
import lombok.*;
import com.invernadero.cenit.enums.Tipoinsumo;

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
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Tipoinsumo tipo;
    @Column(length = 20, nullable = false)
    private String unidadMedida;
    @Column(nullable = false)
    private Double stockActual;

}
