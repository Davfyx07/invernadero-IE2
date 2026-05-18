package com.invernadero.cenit.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:cenit@app.com}")
    private String fromEmail;

    private void sendHtml(String to, String subject, String html) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
            log.info("Email enviado a {}", to);
        } catch (MessagingException e) {
            log.error("Error enviando email a {}: {}", to, e.getMessage());
        }
    }

    private String htmlTemplate(String title, String bodyContent) {
        return "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><style>"
            + "body{font-family:'Segoe UI',system-ui,sans-serif;background:#f8fafc;margin:0;padding:0;}"
            + ".wrap{max-width:520px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);}"
            + ".head{background:linear-gradient(135deg,#059669,#047857);padding:32px 24px;text-align:center;color:#fff;}"
            + ".head h1{margin:0;font-size:22px;font-weight:600;}"
            + ".head p{margin:6px 0 0;font-size:13px;opacity:.85;}"
            + ".bod{padding:32px 28px;color:#334155;font-size:14px;line-height:1.7;}"
            + ".codebox{background:#f0fdf4;border:1px dashed #86efac;border-radius:12px;padding:20px;text-align:center;margin:20px 0;}"
            + ".codebox .lbl{color:#059669;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;}"
            + ".codebox .code{color:#047857;font-size:32px;font-weight:700;font-family:monospace;letter-spacing:4px;}"
            + ".btn{display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:500;font-size:13px;margin-top:8px;}"
            + ".foot{padding:20px 28px;border-top:1px solid #f1f5f9;text-align:center;color:#94a3b8;font-size:12px;}"
            + "</style></head><body>"
            + "<div class='wrap'><div class='head'><h1>" + title + "</h1><p>Cenit - Gestion de Invernaderos</p></div>"
            + "<div class='bod'>" + bodyContent + "</div>"
            + "<div class='foot'>2026 Cenit Agricultural Systems<br/>Si no esperabas este mensaje, ignoralo.</div></div>"
            + "</body></html>";
    }

    public void sendOtp(String to, String code, String purpose) {
        String body = "<p>Hola,</p><p>Recibimos una solicitud para <strong>" + purpose + "</strong> en tu cuenta de Cenit.</p>"
            + "<div class='codebox'><div class='lbl'>Tu codigo de verificacion</div><div class='code'>" + code + "</div></div>"
            + "<p style='text-align:center;color:#64748b;font-size:12px;'>Este codigo expira en <strong>15 minutos</strong>. No lo compartas con nadie.</p>";
        sendHtml(to, "Cenit - Codigo de verificacion", htmlTemplate("Verificacion de seguridad", body));
    }

    public void sendTempPassword(String to, String tempPassword) {
        String body = "<p>Hola,</p><p>Tu cuenta en <strong>Cenit</strong> ha sido creada exitosamente.</p>"
            + "<div class='codebox'><div class='lbl'>Contrasena temporal</div><div class='code' style='font-size:22px;letter-spacing:2px;'>" + tempPassword + "</div></div>"
            + "<p>Al iniciar sesion por primera vez se te pedira cambiar esta contrasena por una personal.</p>"
            + "<p style='text-align:center;'><a href='http://localhost:5173/login' class='btn'>Iniciar sesion</a></p>";
        sendHtml(to, "Cenit - Tu cuenta ha sido creada", htmlTemplate("Bienvenido a Cenit", body));
    }

    public void sendAsignacionCultivo(String to, String nombreResponsable, String especie, String variedad, String zonaNombre) {
        String body = "<p>Hola <strong>" + nombreResponsable + "</strong>,</p>"
            + "<p>Se te ha asignado como <strong>responsable</strong> de un nuevo cultivo:</p>"
            + "<div class='codebox' style='text-align:left;'><div style='font-size:16px;font-weight:600;color:#047857;margin-bottom:4px;'>"
            + especie + (variedad != null ? " - " + variedad : "") + "</div>"
            + "<div style='font-size:13px;color:#64748b;'>Zona: <strong>" + zonaNombre + "</strong></div></div>"
            + "<p style='text-align:center;'><a href='http://localhost:5173/cultivos' class='btn'>Ver cultivos</a></p>";
        sendHtml(to, "Cenit - Te han asignado un cultivo", htmlTemplate("Nueva asignacion de cultivo", body));
    }

    public void sendAsignacionRegistro(String to, String nombreResponsable, String tipo, String cultivo, String fecha) {
        String body = "<p>Hola <strong>" + nombreResponsable + "</strong>,</p>"
            + "<p>Se te ha asignado una nueva actividad en el sistema:</p>"
            + "<div class='codebox' style='text-align:left;'><div style='font-size:16px;font-weight:600;color:#047857;margin-bottom:4px;'>"
            + tipo + "</div><div style='font-size:13px;color:#64748b;'>Cultivo: <strong>" + cultivo + "</strong></div>"
            + "<div style='font-size:13px;color:#64748b;'>Fecha: <strong>" + fecha + "</strong></div></div>"
            + "<p style='text-align:center;'><a href='http://localhost:5173/registros' class='btn'>Ver actividades</a></p>";
        sendHtml(to, "Cenit - Nueva actividad asignada", htmlTemplate("Nueva actividad asignada", body));
    }
}
