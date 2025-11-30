package utez.edu.mx.backendparking.modules.usuario.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;
import utez.edu.mx.backendparking.security.JWTUtils;
import utez.edu.mx.backendparking.shared.api.ApiResponse;
import utez.edu.mx.backendparking.modules.roles.ERole;
import utez.edu.mx.backendparking.modules.usuario.UsuarioRepository;
import utez.edu.mx.backendparking.modules.usuario.dto.ActualizarContraDto;
import utez.edu.mx.backendparking.modules.usuario.dto.ActualizarUsuarioDto;
import utez.edu.mx.backendparking.modules.usuario.dto.BuscarIdDto;
import utez.edu.mx.backendparking.modules.usuario.dto.EmpleadoRegisterDto;
import utez.edu.mx.backendparking.modules.usuario.Usuario;
import utez.edu.mx.backendparking.modules.roles.Roles;
import utez.edu.mx.backendparking.modules.roles.Repository.RolesRepository;
import utez.edu.mx.backendparking.shared.exception.ResourceNotFoundException;

@Service
public class AuthUserServiceImpl {
    private static final Logger log = Logger.getLogger(AuthUserServiceImpl.class.getName());

    private final UsuarioRepository usuarioRepository;
    private final RolesRepository rolesRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtils jwtUtils;

    public AuthUserServiceImpl(UsuarioRepository usuarioRepository, RolesRepository rolesRepository,
            PasswordEncoder passwordEncoder, JWTUtils jwtUtils) {
        this.usuarioRepository = usuarioRepository;
        this.rolesRepository = rolesRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }


    public ApiResponse<?> createEmpleado(EmpleadoRegisterDto request) {
        try {
            Usuario usuarioExistente = usuarioRepository.findByCorreo(request.getCorreo());
            if (usuarioExistente != null) {
                return ApiResponse.error(HttpStatus.BAD_REQUEST, "El usuario ya existe", null);
            }

            Roles rol = rolesRepository.findByName(ERole.EMPLEADO)
                    .orElseThrow(() -> new ResourceNotFoundException("Rol empleado no encontrado"));

          Usuario nuevoUsuario = new Usuario();
          nuevoUsuario.setNombre(request.getNombre());
          nuevoUsuario.setApellidos(request.getApellidos());
          nuevoUsuario.setCorreo(request.getCorreo());
          nuevoUsuario.setTelefono(request.getTelefono());
          // Generar contraseña automática: apellidos + "123"
          String contraseñaGenerada = request.getApellidos() + "123";
           System.out.println(contraseñaGenerada);
          nuevoUsuario.setContra(passwordEncoder.encode(contraseñaGenerada));
          nuevoUsuario.setStatus(true);
          nuevoUsuario.setEsPensionado(false);
          nuevoUsuario.setRol(rol);

            usuarioRepository.save(nuevoUsuario);

            return ApiResponse.success(HttpStatus.CREATED, "Usuario creado exitosamente", null);

        } catch (Exception e) {
            log.severe("Error creating user: " + e.getMessage());
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "No se pudo crear el usuario: " + e.getMessage(),
                    null);
        }
    }

    public ApiResponse<?> Login(String correo, String contra) {
        Usuario usuario = usuarioRepository.findByCorreo(correo);

        if (usuario == null || !passwordEncoder.matches(contra, usuario.getContra())) {
            return ApiResponse.error(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas", null);
        }

        if (!usuario.isStatus()) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, "Tu cuenta está desactivada", null);
        }

        String role = usuario.getRol().getName().name();
        Long id = usuario.getId();

        String token = jwtUtils.generateAccessToken(correo, role, id);

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("expiration", System.currentTimeMillis() + (1000 * 60 * 60));
        data.put("user", Map.of(
                "id", id,
                "correo", correo,
                "role", role));

        return ApiResponse.success(HttpStatus.OK, "Inicio exitoso", data);
    }

    public ApiResponse<?> ModificarDatosEmpleado(ActualizarUsuarioDto request, Long id) {
        try {
            Usuario usuario = usuarioRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

            usuario.setNombre(request.getNombre());
            usuario.setApellidos(request.getApellidos());

            if (!usuario.getCorreo().equals(request.getCorreo())
                    && usuarioRepository.existsByCorreo(request.getCorreo())) {
                return ApiResponse.error(HttpStatus.BAD_REQUEST, "El correo ya está registrado por otro usuario", null);
            }

            usuario.setCorreo(request.getCorreo());
            usuario.setTelefono(request.getTelefono());

            usuarioRepository.save(usuario);

            return ApiResponse.success(HttpStatus.OK, "Usuario modificado exitosamente", null);
        } catch (ResourceNotFoundException e) {
            log.severe("Error modifying user: " + e.getMessage());
            return ApiResponse.error(HttpStatus.NOT_FOUND, e.getMessage(), null);
        } catch (Exception e) {
            log.severe("Error modifying user: " + e.getMessage());
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,
                    "No se pudo modificar el usuario: " + e.getMessage(), null);
        }
    }

    public ApiResponse<?> ConsultarDatos(Long id) {
        try {
            Usuario usuario = usuarioRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

            Map<String, Object> datosUsuario = new HashMap<>();
            datosUsuario.put("id", usuario.getId());
            datosUsuario.put("nombre", usuario.getNombre());
            datosUsuario.put("apellidos", usuario.getApellidos());
            datosUsuario.put("correo", usuario.getCorreo());
            datosUsuario.put("telefono", usuario.getTelefono());
            datosUsuario.put("rol", usuario.getRol().getName());
            datosUsuario.put("status", usuario.isStatus());
            datosUsuario.put("esPensionado", usuario.isEsPensionado());

            return ApiResponse.success(HttpStatus.OK, "Datos del usuario obtenidos exitosamente", datosUsuario);
        } catch (ResourceNotFoundException e) {
            log.severe("Error consulting user: " + e.getMessage());
            return ApiResponse.error(HttpStatus.NOT_FOUND, e.getMessage(), null);
        } catch (Exception e) {
            log.severe("Error consulting user: " + e.getMessage());
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,
                    "No se pudieron obtener los datos del usuario: " + e.getMessage(), null);
        }
    }

    public ApiResponse<?> ActualizarContraseña(ActualizarContraDto resquest, Long id) {
        try {
            Usuario usuario = usuarioRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

            usuario.setContra(passwordEncoder.encode(resquest.getContra()));

            usuarioRepository.save(usuario);

            return ApiResponse.success(HttpStatus.OK, "Contraseña modificada exitosamente", null);
        } catch (ResourceNotFoundException e) {
            log.severe("Error modifying password: " + e.getMessage());
            return ApiResponse.error(HttpStatus.NOT_FOUND, e.getMessage(), null);
        } catch (Exception e) {
            log.severe("Error modifying password: " + e.getMessage());
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,
                    "No se pudo modificar la contraseña: " + e.getMessage(), null);
        }
    }

    public ApiResponse<?> buscarIdPorCorreo(String correo) {
        try {
            Usuario usuario = usuarioRepository.findByCorreo(correo);
            if (usuario == null) {
                return ApiResponse.error(HttpStatus.NOT_FOUND, "Usuario no encontrado", null);
            }
            Map<String, Object> data = new HashMap<>();
            data.put("id", usuario.getId());
            return ApiResponse.success(HttpStatus.OK, "ID del usuario obtenido exitosamente", data);
        } catch (Exception e) {
            log.severe("Error buscando usuario por correo: " + e.getMessage());
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "No se pudo obtener el ID del usuario", null);
        }
    }

}