package utez.edu.mx.backendparking.modules.usuario.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import utez.edu.mx.backendparking.modules.usuario.dto.LoginRequest;
import utez.edu.mx.backendparking.modules.usuario.service.AuthUserServiceImpl;
import utez.edu.mx.backendparking.modules.usuario.dto.ActualizarContraDto;
import utez.edu.mx.backendparking.modules.usuario.dto.ActualizarUsuarioDto;
import utez.edu.mx.backendparking.modules.usuario.dto.EmpleadoRegisterDto;
import utez.edu.mx.backendparking.shared.api.ApiResponse;

@RestController
@RequestMapping("/api/auth")
@Tag(name="Auth and Create Users", description = "Endpoints para autenticacion y creacion de los distintos tipos de usuarios")
public class AuthAndCreateUsersController {

    private final AuthUserServiceImpl authUserService;

    public AuthAndCreateUsersController(AuthUserServiceImpl authUserService) {
        this.authUserService = authUserService;
    }

    @PostMapping("/private/registrarEmpleado")
    @Operation(summary = "Registrar empleado",description="Administrador registra empleados", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<?>> createEmpleado(@RequestBody EmpleadoRegisterDto empleadoRegisterDto) {
        ApiResponse<?> response = authUserService.createEmpleado(empleadoRegisterDto);

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping("/public/login")
    @Operation(summary = "Login",description="Loguearse en el sistema para obtener JWT")
    public ResponseEntity<ApiResponse<?>> login(@RequestBody @Valid  LoginRequest loginRequest) {
        ApiResponse<?> response = authUserService.Login(loginRequest.getCorreo(), loginRequest.getContra());

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping("/actualizarDatosUsuario")
    @Operation(summary = "Actualizar datos de cualquier usuario",description="Esto es para que el usuario actualice sus datos personales desde perfil")
    public ResponseEntity<ApiResponse<?>> ModificarDatosEmpleado(@RequestBody @Valid ActualizarUsuarioDto actualizarUsuarioDto) {
        ApiResponse<?> response = authUserService.ModificarDatosEmpleado(actualizarUsuarioDto, actualizarUsuarioDto.getId());

        return ResponseEntity.status(response.getStatus()).body(response);
    }
    @PostMapping("/actualizarContraUsuario")
    @Operation(summary = "Actualizar contraseña de cualquier usuario",description="Esto es para que el usuario actualice su contraseña desde perfil")
    public ResponseEntity<ApiResponse<?>> ActualizarContraseña(@RequestBody @Valid ActualizarContraDto actualizarContraDto) {
        ApiResponse<?> response = authUserService.ActualizarContraseña(actualizarContraDto, actualizarContraDto.getId());

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/consultarDatos/{id}")
    @Operation(summary = "Consultar datos de usuario",description="Obtiene todos los datos del usuario por su ID", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<?>> ConsultarDatos(@PathVariable Long id) {
        ApiResponse<?> response = authUserService.ConsultarDatos(id);

        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
