package com.invernadero.cenit.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

/**
 * Configuración de JWT: generación y validación de tokens.
 *
 * @author Cenit Team
 * @version 1.0.0
 * @since 2025-05-17
 */
@Configuration
public class JwtConfig {

    @Value("${jwt.secret:defaultSecretKeyParaDesarrolloLocalCenit2025}")
    private String secret;

    @Value("${jwt.expiration-hours:24}")
    private long expirationHours;

    @Bean
    public SecretKey jwtSigningKey() {
        byte[] keyBytes = java.util.Base64.getEncoder().encode(secret.getBytes());
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String email) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(email)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(expirationHours, ChronoUnit.HOURS)))
                .signWith(jwtSigningKey())
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parser()
                .verifyWith(jwtSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parser()
                    .verifyWith(jwtSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
