package utez.edu.mx.backendparking.modules.usuario.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.backendparking.modules.usuario.Usuario;
import utez.edu.mx.backendparking.modules.usuario.UsuarioRepository;
import utez.edu.mx.backendparking.modules.usuario.dto.ActualizarUsuarioBasicoDto;
import utez.edu.mx.backendparking.modules.usuario.dto.UsuarioResponseDto;
import utez.edu.mx.backendparking.shared.exception.ResourceNotFoundException;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Transactional(readOnly = true)
    public Usuario getOneForBackend(Long id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        return usuario.orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    @Transactional(readOnly = true)
    public Page<UsuarioResponseDto> findAllUsuariosPaginados(Pageable pageable, String search, String tipoUsuario) {
        // Definir ordenamiento por defecto (por id) si no viene especificado
        Sort sort = pageable.getSort().isSorted()
                ? pageable.getSort()
                : Sort.by("id").descending();

        PageRequest pageRequest = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                sort
        );

        Page<Usuario> usuariosPage;

        // Determinar si hay filtro por tipo de usuario
        Boolean esPensionadoFilter = null;
        if (tipoUsuario != null && !tipoUsuario.trim().isEmpty()) {
            if ("pensionado".equalsIgnoreCase(tipoUsuario.trim())) {
                esPensionadoFilter = true;
            } else if ("empleado".equalsIgnoreCase(tipoUsuario.trim())) {
                esPensionadoFilter = false;
            }
        }

        // Aplicar búsqueda y filtro
        if (search != null && !search.trim().isEmpty()) {
            String searchTerm = "%" + search.trim().toLowerCase() + "%";
            if (esPensionadoFilter != null) {
                // Búsqueda con filtro de tipo
                usuariosPage = usuarioRepository.findBySearchTermAndEsPensionado(searchTerm, esPensionadoFilter, pageRequest);
            } else {
                // Búsqueda sin filtro de tipo
                usuariosPage = usuarioRepository.findBySearchTerm(searchTerm, pageRequest);
            }
        } else {
            if (esPensionadoFilter != null) {
                // Solo filtro de tipo, sin búsqueda
                usuariosPage = usuarioRepository.findByEsPensionado(esPensionadoFilter, pageRequest);
            } else {
                // Todos los usuarios sin filtros
                usuariosPage = usuarioRepository.findAll(pageRequest);
            }
        }

        return usuariosPage.map(this::mapToResponseDto);
    }

    @Transactional(rollbackFor = Exception.class)
    public void changeStatus(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        usuario.setStatus(!usuario.isStatus());
        usuarioRepository.save(usuario);
    }

    @Transactional(rollbackFor = Exception.class)
    public UsuarioResponseDto actualizarUsuario(Long id, ActualizarUsuarioBasicoDto dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        usuario.setNombre(dto.getNombre().trim());
        usuario.setApellidos(dto.getApellidos().trim());
        
        usuarioRepository.save(usuario);
        
        return mapToResponseDto(usuario);
    }

    @Transactional(rollbackFor = Exception.class)
    public void restablecerContrasena(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        // Generar nueva contraseña: apellidos + "123"
        String nuevaContrasena = usuario.getApellidos().trim() + "123";
        usuario.setContra(passwordEncoder.encode(nuevaContrasena));
        
        usuarioRepository.save(usuario);
        
        // Enviar correo notificando el restablecimiento
        enviarCorreoRestablecimiento(usuario, nuevaContrasena);
    }

    private void enviarCorreoRestablecimiento(Usuario usuario, String nuevaContrasena) {
        try {
            String subject = "Contraseña restablecida - Sistema de Estacionamiento";
            String htmlContent = construirHtmlRestablecimiento(usuario.getNombre(), nuevaContrasena);
            
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(usuario.getCorreo());
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            
            javaMailSender.send(mimeMessage);
        } catch (Exception e) {
            // Log del error pero no lanzar excepción para no afectar la transacción
            System.err.println("Error al enviar correo de restablecimiento: " + e.getMessage());
        }
    }

    private String construirHtmlRestablecimiento(String nombre, String nuevaContrasena) {
        return String.format("""
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
                body { margin: 0; padding: 0; background: #F4F6F8; font-family: 'Poppins', Arial, sans-serif; }
                .container { max-width: 600px; margin: 35px auto; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 6px 18px rgba(0,0,0,0.1); border: 1px solid #e0e0e0; }
                .header { background: #0F4C4C; padding: 35px; text-align: center; color: white; }
                .header h1 { margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px; }
                .content { padding: 30px; color: #374151; font-size: 15px; line-height: 1.7; }
                .password-box { margin: 25px auto; background: #EFFFFD; border-left: 6px solid #0F4C4C; padding: 18px; border-radius: 8px; text-align: center; }
                .password { font-size: 24px; font-weight: bold; color: #0F4C4C; letter-spacing: 3px; }
                .footer { background: #F9FAFB; padding: 20px; text-align: center; font-size: 13px; color: #6B7280; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1> Sistema de Estacionamiento</h1>
                </div>
                <div class="content">
                    <h2 style="color: #0F4C4C;">Hola, %s!</h2>
                    <p>Tu contraseña ha sido restablecida exitosamente por el administrador del sistema.</p>
                    <p>Tu nueva contraseña temporal es:</p>
                    <div class="password-box">
                        <div class="password">%s</div>
                    </div>
                    <p><strong>Por seguridad, te recomendamos cambiar esta contraseña desde tu perfil de usuario al iniciar sesión.</strong></p>
                    <p>Si no solicitaste este cambio, por favor contacta al administrador inmediatamente.</p>
                </div>
                <div class="footer">
                    <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
                    <p>© 2025 Sistema de Estacionamiento. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>
        """, nombre, nuevaContrasena);
    }

    private UsuarioResponseDto mapToResponseDto(Usuario usuario) {
        UsuarioResponseDto dto = new UsuarioResponseDto();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setApellidos(usuario.getApellidos());
        dto.setCorreo(usuario.getCorreo());
        dto.setTelefono(usuario.getTelefono());
        dto.setStatus(usuario.isStatus());
        dto.setEsPensionado(usuario.isEsPensionado());
        dto.setRolNombre(usuario.getRol() != null ? usuario.getRol().getName().toString(): null);
        return dto;
    }
}
