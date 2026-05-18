package com.invernadero.cenit.dto;

import com.invernadero.cenit.entity.Usuario;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para respuesta de autenticación con token JWT.
 *
 * @author Cenit Team
 * @version 1.0.0
 * @since 2025-05-17
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String type;
    private Usuario usuario;
    @Builder.Default
    private boolean requiresVerification = false;
    @Builder.Default
    private boolean requiresPasswordChange = false;
}
