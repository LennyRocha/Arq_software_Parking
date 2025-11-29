package utez.edu.mx.backendparking.modules.mail.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import utez.edu.mx.backendparking.modules.mail.model.Mail;
import utez.edu.mx.backendparking.modules.mail.service.MailService;
import utez.edu.mx.backendparking.shared.api.ApiResponse;

@RestController
@RequestMapping("/api/email")
@Tag(name="Servicio de correos", description = "Servicio para enviar correos para recuperación de contraseña")
public class MailController {
    
    private final MailService mailService;

    @Autowired
    public MailController(MailService mailService) {
        this.mailService = mailService;
    }

    @PostMapping("/send/{email}")
    @Operation(summary = "Enviar código de verificación", description = "Envía un correo con código de verificación para recuperar contraseña")
    public ResponseEntity<ApiResponse<?>> sendMail(@PathVariable String email, @RequestBody Mail mail) {
        ApiResponse<?> response = mailService.sendMail(email, mail);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
