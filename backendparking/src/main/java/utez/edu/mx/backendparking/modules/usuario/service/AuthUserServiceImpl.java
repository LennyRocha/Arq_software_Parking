package utez.edu.mx.backendparking.modules.usuario.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.logging.Logger;
import utez.edu.mx.backendparking.security.JWTUtils;
import utez.edu.mx.backendparking.shared.api.ApiResponse;
import utez.edu.mx.backendparking.modules.roles.ERole;
import utez.edu.mx.backendparking.modules.usuario.UsuarioRepository;
import utez.edu.mx.backendparking.modules.usuario.dto.EmpleadoRegisterDto;
import utez.edu.mx.backendparking.modules.usuario.Usuario;
import utez.edu.mx.backendparking.modules.roles.Roles;
import utez.edu.mx.backendparking.modules.roles.Repository.RolesRepository;
import utez.edu.mx.backendparking.shared.exception.ResourceNotFoundException;

@Service
public class AuthUserServiceImpl {
    private static final Logger log = Logger.getLogger(AuthUserServiceImpl.class.getName());

    private final UsuarioRepository  usuarioRepository;
    private final RolesRepository rolesRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtils jwtUtils;

    public AuthUserServiceImpl(UsuarioRepository usuarioRepository, RolesRepository rolesRepository, PasswordEncoder passwordEncoder, JWTUtils jwtUtils) {
        this.usuarioRepository = usuarioRepository;
        this.rolesRepository = rolesRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    //METODO PARA CREAR USUARIO CLIENTE DESDE LANDING PAGE

    public ApiResponse<?> createEmpleado(EmpleadoRegisterDto request){
       try{
          Usuario usuarioExistente = usuarioRepository.findByCorreo(request.getCorreo());
          if(usuarioExistente != null){
              return ApiResponse.error(HttpStatus.BAD_REQUEST, "El usuario ya existe", null);
          }

          Roles rol = rolesRepository.findByName(ERole.CLIENTE_PENSIONADO)
                  .orElseThrow(()-> new ResourceNotFoundException("Rol cliente pensionado no encontrado"));
          if(rol == null){
              rol = new Roles();
              rol.setName(ERole.CLIENTE_PENSIONADO);
              rolesRepository.save(rol);
          }

          Usuario nuevoUsuario = new Usuario();
          nuevoUsuario.setNombre(request.getNombre());
          nuevoUsuario.setApellidos(request.getApellidos());
          nuevoUsuario.setCorreo(request.getCorreo());
          nuevoUsuario.setTelefono(request.getTelefono());
          nuevoUsuario.setContra(passwordEncoder.encode(request.getContra()));
          nuevoUsuario.setStatus(true);
          nuevoUsuario.setEsPensionado(false);
          nuevoUsuario.setRol(rol);

          usuarioRepository.save(nuevoUsuario);

          return ApiResponse.success(HttpStatus.CREATED, "Usuario creado exitosamente", null);

       } catch(Exception e){
          log.severe("Error creating user: " + e.getMessage());
          return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "No se pudo crear el usuario: " + e.getMessage(), null);
       }
    }

    public ApiResponse<?> Login(String correo, String contra) {
        try {
            Usuario usuario = usuarioRepository.findByCorreo(correo);

            if (!passwordEncoder.matches(contra, usuario.getContra())) {
                return ApiResponse.error(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas", null);
            }

            if (!usuario.isStatus()) {
                return ApiResponse.error(HttpStatus.BAD_REQUEST, "Tu cuenta esta desactivada", null);
            }

            String role = usuario.getRol().getName().name();
            Long id = usuario.getId();
            String token = jwtUtils.generateAccessToken(correo, role, id);
            return ApiResponse.success(HttpStatus.OK, token, null);

        } catch (Exception e) {
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "No se pudo iniciar sesion", null);
        }
    }


}