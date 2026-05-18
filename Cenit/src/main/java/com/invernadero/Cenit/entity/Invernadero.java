package com.invernadero.cenit.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;

@Entity
@Table(name = "invernaderos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invernadero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 100, nullable = false)
    private String nombre;
    @Column(length = 200)
    private String ubicacion;
    private String descripcion;
    @Column(nullable = false)
    private LocalDateTime creadoEn;
    @Builder.Default
    @Column(nullable = false)
    private boolean activo = true;

    @PrePersist
    public void prePersist() {
        if (this.creadoEn == null) {
            this.creadoEn = LocalDateTime.now();
        }
    }

}
