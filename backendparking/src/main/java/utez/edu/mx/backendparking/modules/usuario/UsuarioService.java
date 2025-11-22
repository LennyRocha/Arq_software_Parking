package utez.edu.mx.backendparking.modules.usuario;
import utez.edu.mx.backendparking.modules.usuario.Request.UsuarioRequest;
import utez.edu.mx.backendparking.shared.api.ApiResponse;
public interface UsuarioService {
    ApiResponse<?> createUser(UsuarioRequest request);
} 