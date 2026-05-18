package com.invernadero.cenit.handler;

import com.invernadero.cenit.dto.AuthResponse;
import com.invernadero.cenit.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Handler de éxito para login OAuth2 (Google).
 * Busca o crea el usuario y redirige al frontend con el token JWT.
 *
 * @author Cenit Team
 * @version 1.0.0
 * @since 2025-05-17
 */
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final AuthService authService;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        AuthResponse authResponse = authService.loginOrRegisterOAuth(email, name);

        String redirectUrl = frontendUrl + "/login?token=" + authResponse.getToken();
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
