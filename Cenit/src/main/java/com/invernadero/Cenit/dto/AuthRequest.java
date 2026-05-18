package com.invernadero.cenit.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO para solicitud de inicio de sesión.
 *
 * @author Cenit Team
 * @version 1.0.0
 * @since 2025-05-17
 */
@Data
public class AuthRequest {

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo no tiene un formato válido")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    private String password;
}
