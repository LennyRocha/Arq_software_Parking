package utez.edu.mx.backendparking.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import utez.edu.mx.backendparking.modules.usuario.Usuario;

/**
 * Utilidad para acceder al usuario autenticado actual desde el SecurityContext
 */
@Component
public class SecurityUtils {

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

        if (principal instanceof Usuario) {
            return (Usuario) principal;
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
                authentication.getPrincipal() instanceof Usuario;
    }
}
