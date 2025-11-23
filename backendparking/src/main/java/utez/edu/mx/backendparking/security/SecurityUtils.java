package utez.edu.mx.backendparking.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import utez.edu.mx.backendparking.modules.usuario.Usuario;
import utez.edu.mx.backendparking.modules.usuario.UsuarioRepository;

/**
 * Utilidad para acceder al usuario autenticado actual desde el SecurityContext
 */
@Component
public class SecurityUtils {

    private static UsuarioRepository usuarioRepository;

    @Autowired
    public SecurityUtils(UsuarioRepository usuarioRepository) {
        SecurityUtils.usuarioRepository = usuarioRepository;
    }

    /**
     * Obtiene el usuario autenticado actual desde el SecurityContext
     * @return UserEntity del usuario autenticado
     * @throws RuntimeException si no hay usuario autenticado
     */
    public static Usuario getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No hay usuario autenticado");
        }

        Object principal = authentication.getPrincipal();

        // Si el principal es un Usuario, devolverlo directamente
        if (principal instanceof Usuario) {
            return (Usuario) principal;
        }

        // Si el principal es un String (email), buscar el usuario en la base de datos
        if (principal instanceof String) {
            String email = (String) principal;
            Usuario usuario = usuarioRepository.findByCorreo(email);

            if (usuario == null) {
                throw new RuntimeException("Usuario no encontrado con el email: " + email);
            }

            return usuario;
        }

        throw new RuntimeException("El usuario autenticado no es del tipo esperado");
    }

    /**
     * Obtiene el ID del usuario autenticado actual
     * @return ID del usuario
     */
    public static Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    /**
     * Obtiene el email del usuario autenticado actual
     * @return Email del usuario
     */
    public static String getCurrentUserEmail() {
        return getCurrentUser().getCorreo();
    }

    /**
     * Verifica si hay un usuario autenticado
     * @return true si hay usuario autenticado
     */
    public static boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated() &&
                (authentication.getPrincipal() instanceof Usuario || authentication.getPrincipal() instanceof String);
    }
}
