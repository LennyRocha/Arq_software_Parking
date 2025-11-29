package utez.edu.mx.backendparking.modules.mail.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import utez.edu.mx.backendparking.modules.mail.model.Mail;
import utez.edu.mx.backendparking.modules.usuario.Usuario;
import utez.edu.mx.backendparking.modules.usuario.UsuarioRepository;
import utez.edu.mx.backendparking.shared.api.ApiResponse;

import java.util.HashMap;
import java.util.Map;

@Service
public class MailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public ApiResponse<?> sendMail(String mail, Mail request) {
        try {
            Usuario usuario = usuarioRepository.findByCorreo(mail);

            if (usuario != null) {
                int verificationCode = (int) (Math.random() * 900000) + 100000;

                String codeMessage = request.getMessage();

                String subject = request.getSubject();

                // Construir el HTML
                String htmlContent = construirHtmlCorreo(subject, codeMessage, verificationCode);

                try {
                    MimeMessage mimeMessage = javaMailSender.createMimeMessage();
                    MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
                    helper.setFrom(fromEmail);
                    helper.setTo(mail);
                    helper.setSubject(subject);
                    helper.setText(htmlContent, true);

                    javaMailSender.send(mimeMessage);

                    Map<String, Object> responseData = new HashMap<>();
                    responseData.put("code", verificationCode);

                    return ApiResponse.success(HttpStatus.OK,
                            "Correo enviado exitosamente con el código",
                            responseData);

                } catch (Exception mailException) {
                    return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,
                            "Error al enviar el correo: " + mailException.getMessage(),
                            null);
                }

            } else {
                return ApiResponse.error(HttpStatus.NOT_FOUND,
                        "El correo no está registrado",
                        null);
            }

        } catch (Exception e) {
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error al procesar: " + e.getMessage(),
                    null);
        }
    }

    private String construirHtmlCorreo(String subject, String codeMessage, int code) {

        return """
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

                body {
                    margin: 0;
                    padding: 0;
                    background: #F4F6F8;
                    font-family: 'Poppins', Arial, sans-serif;
                }

                .container {
                    max-width: 600px;
                    margin: 35px auto;
                    background: #ffffff;
                    border-radius: 14px;
                    overflow: hidden;
                    box-shadow: 0 6px 18px rgba(0,0,0,0.1);
                    border: 1px solid #e0e0e0;
                }

                .header {
                    background: #0F4C4C;
                    padding: 35px;
                    text-align: center;
                    color: white;
                }

                .header h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: bold;
                    letter-spacing: 1px;
                }

                .subheader {
                    font-size: 14px;
                    opacity: 0.9;
                }

                .subject {
                    padding: 20px 30px;
                    text-align: center;
                    font-size: 22px;
                    font-weight: 600;
                    color: #0F4C4C;
                    border-bottom: 1px solid #E5E7EB;
                }

                .content {
                    padding: 30px;
                    color: #374151;
                    font-size: 15px;
                    line-height: 1.7;
                }

                .code-box {
                    margin: 25px auto;
                    background: #EFFFFD;
                    border-left: 6px solid #0F4C4C;
                    padding: 18px;
                    border-radius: 8px;
                    font-size: 24px;
                    text-align: center;
                    font-weight: bold;
                    color: #0F4C4C;
                    letter-spacing: 3px;
                }

                .warning {
                    margin-top: 10px;
                    font-size: 14px;
                    color: #B91C1C;
                    text-align: center;
                    font-weight: 600;
                }

                .divider {
                    height: 1px;
                    width: 100%;
                    background: #e5e7eb;
                    margin: 35px 0;
                }

                .contact {
                    text-align: center;
                }

                .contact-title {
                    color: #0F4C4C;
                    font-weight: 600;
                    font-size: 16px;
                }

                .contact-info {
                    font-size: 18px;
                    color: #2F6F6F;
                    font-weight: bold;
                }

                .footer {
                    text-align: center;
                    padding: 18px;
                    font-size: 13px;
                    color: #6b7280;
                    background: #F9FAFB;
                    border-top: 1px solid #E5E7EB;
                }

                .signature {
                    background: #0F4C4C;
                    color: white;
                    text-align: center;
                    padding: 12px;
                    font-size: 12px;
                    opacity: 0.95;
                }

            </style>
        </head>

        <body>
            <div class="container">

                <div class="header">
                    <h1>PARKING SYSTEM</h1>
                    <p class="subheader">Sistema de Gestión de Estacionamiento</p>
                </div>

                <div class="subject">
                """ + subject + """
                </div>

                <div class="content">
                    <p>Estimado usuario,</p>
                    <p>
                """ + codeMessage + """
                </p>

                    <div class="code-box">
                """ + code + """
                </div>

                    <p class="warning">⚠ No compartas este código con nadie.</p>

                    <div class="divider"></div>

                    <div class="contact">
                        <p class="contact-title">¿Necesitas ayuda?</p>
                        <p class="contact-info">📞 +52 777 000 0000</p>
                    </div>
                </div>

                <div class="footer">
                    Este es un mensaje automático. No respondas.
                </div>

                <div class="signature">
                    © 2024 Parking System — Todos los derechos reservados
                </div>

            </div>
        </body>
        </html>
        """;
    }
}
