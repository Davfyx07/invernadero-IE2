package com.invernadero.cenit.taiga;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
public class TaigaClient {

    private final RestClient restClient;

    @Value("${taiga.api-url}")
    private String apiUrl;

    @Value("${taiga.username}")
    private String username;

    @Value("${taiga.password}")
    private String password;

    @Value("${taiga.project-id}")
    private String projectId;

    public TaigaClient() {
        this.restClient = RestClient.builder().build();
    }

    private String authenticate() {
        Map<String, String> body = Map.of(
                "username", username,
                "password", password,
                "type","normal"
        );
        Map<?, ?> response = restClient.post()
                .uri(apiUrl + "/auth")
                .body(body)
                .retrieve()
                .body(Map.class);

        return (String) response.get("auth_token");
    }

    public void createIssue(String title, String description) {
        try {
            String token = authenticate();

            Map<String, Object> issueBody = Map.of(
                    "project", projectId,
                    "subject", title,
                    "description", description,
                    "type", 1,        // ID del tipo de incidencia en tu Taiga (ej: Bug)
                    "severity", 3,    // ID de severidad
                    "priority", 3     // ID de prioridad
            );

            restClient.post()
                    .uri(apiUrl + "/issues")
                    .header("Authorization", "Bearer " + token)
                    .body(issueBody)
                    .retrieve()
                    .toBodilessEntity();

            System.out.println("➔ [Taiga] Incidencia creada correctamente por fallo en test.");
        } catch (Exception e) {
            System.err.println("➔ [Taiga] Error al reportar el fallo: " + e.getMessage());
        }
    }


}
