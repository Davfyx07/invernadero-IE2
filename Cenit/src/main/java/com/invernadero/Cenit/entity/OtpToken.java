package com.invernadero.cenit.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "otp_tokens")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 150, nullable = false)
    private String email;

    @Column(length = 6, nullable = false)
    private String code;

    @Column(length = 30, nullable = false)
    private String type; // EMAIL_VERIFICATION, PASSWORD_RECOVERY

    @Column(nullable = false)
    private LocalDateTime expiry;

    @Builder.Default
    @Column(nullable = false)
    private boolean used = false;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.expiry == null) {
            this.expiry = LocalDateTime.now().plusMinutes(15);
        }
    }
}
