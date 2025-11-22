package utez.edu.mx.backendparking.modules.login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import utez.edu.mx.backendparking.modules.security.JWTUtils;
import utez.edu.mx.backendparking.modules.usuario.Repository.*;
import utez.edu.mx.backendparking.shared.api.ApiResponse;
import utez.edu.mx.backendparking.modules.usuario.model.Usuario;
@Service
public class LoginService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;
    public ApiResponse<?> Login(String correo, String contra){
        try{
            Usuario usuario= usuarioRepository.findByCorreo(correo);
           if(!passwordEncoder.matches(contra, usuario.getContra())){
            return ApiResponse.error(
                HttpStatus.UNAUTHORIZED,
                "Credenciales incorrectas",
                null
              );
           } else if(!usuario.isStatus()) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST,
            "Tu cuenta esta desactivada", 
            null
            );
            }else{
            String role = usuario.getRol().getName().name();
            Long id=usuario.getId();
            String token = jwtUtils.generateAccessToken(correo, role, id);
            return ApiResponse.success(
        HttpStatus.OK,
        token,
        null
      );
           }   

        }catch(Exception e){
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,
             "No se pudo iniciar sesion",
              null
            );
    }
     

}
}
