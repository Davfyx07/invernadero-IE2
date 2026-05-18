package com.invernadero.cenit.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;
import com.invernadero.cenit.enums.Rol;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 100, nullable = false)
    private String nombre;
    @Column(length = 150, nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String password;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;
    @Builder.Default
    @Column(nullable = false)
    private boolean activo = true;
    @Builder.Default
    @Column(nullable = false)
    private boolean emailVerified = false;
    @Builder.Default
    @Column(nullable = false)
    private boolean firstLogin = true;
    @Column(nullable = false)
    private LocalDateTime creadoEn;

    @PrePersist
    public void prePersist() {
        if (this.creadoEn == null) {
            this.creadoEn = LocalDateTime.now();
        }
    }

}
