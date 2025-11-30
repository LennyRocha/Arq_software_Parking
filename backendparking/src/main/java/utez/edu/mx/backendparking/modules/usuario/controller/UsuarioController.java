package utez.edu.mx.backendparking.modules.usuario.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.backendparking.modules.usuario.Usuario;
import utez.edu.mx.backendparking.modules.usuario.dto.ActualizarUsuarioBasicoDto;
import utez.edu.mx.backendparking.modules.usuario.dto.UsuarioResponseDto;
import utez.edu.mx.backendparking.modules.usuario.service.UserService;
import utez.edu.mx.backendparking.shared.api.ApiResponse;
import utez.edu.mx.backendparking.shared.util.PaginationUtils;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Usuarios", description = "Endpoints para gestión de usuarios")
public class UsuarioController {

    private final UserService userService;

    public UsuarioController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/backend/{id}")
    public Usuario getUsuarioForBackend(@PathVariable Long id) {
        return userService.getOneForBackend(id);
    }

    @GetMapping("/private/getAll")
    @Operation(
        summary = "Obtener usuarios paginados",
        description = "Obtener lista de usuarios con paginación, ordenamiento, búsqueda y filtro por tipo (pensionado/empleado).",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @Parameter(name = "page", description = "Número de página (0 por defecto)", example = "0")
    @Parameter(name = "size", description = "Tamaño de la página (10 por defecto)", example = "10")
    @Parameter(name = "sort", description = "Campo para ordenar. Formato: campo,dirección. Campo por defecto: id,desc", example = "id,desc")
    @Parameter(name = "search", description = "Término de búsqueda (opcional). Busca en: nombre, apellidos, correo")
    @Parameter(name = "tipoUsuario", description = "Filtro por tipo de usuario (opcional): 'pensionado' o 'empleado'")
    public ResponseEntity<ApiResponse<Page<UsuarioResponseDto>>> getUsuariosPaginados(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String tipoUsuario) {

        String[] sortArray = sort.split(",");
        Sort sortObject = PaginationUtils.getSortFromParams(sortArray);
        Pageable pageable = PageRequest.of(page, size, sortObject);

        Page<UsuarioResponseDto> usuariosPage = userService.findAllUsuariosPaginados(pageable, search, tipoUsuario);

        return ResponseEntity.ok(ApiResponse.success(HttpStatus.OK, "Usuarios obtenidos exitosamente", usuariosPage));
    }

    @PutMapping("/private/{id}/status")
    @Operation(
        summary = "Cambiar estatus de usuario",
        description = "Cambiar estatus de un usuario existente en el sistema (activo/inactivo)",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<ApiResponse<Void>> changeStatus(@PathVariable Long id) {
        userService.changeStatus(id);
        return ResponseEntity.ok(ApiResponse.success(HttpStatus.OK, "Estatus de usuario actualizado exitosamente", null));
    }

    @PutMapping("/private/{id}")
    @Operation(
        summary = "Actualizar datos básicos de usuario",
        description = "Actualizar nombre y apellidos de un usuario",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<ApiResponse<UsuarioResponseDto>> actualizarUsuario(
            @PathVariable Long id,
            @RequestBody @Valid ActualizarUsuarioBasicoDto dto) {
        UsuarioResponseDto usuario = userService.actualizarUsuario(id, dto);
        return ResponseEntity.ok(ApiResponse.success(HttpStatus.OK, "Datos del usuario actualizados correctamente", usuario));
    }

    @PostMapping("/private/{id}/restablecer-contrasena")
    @Operation(
        summary = "Restablecer contraseña de usuario",
        description = "Restablece la contraseña del usuario a apellidos+123 y envía notificación por correo",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<ApiResponse<Void>> restablecerContrasena(@PathVariable Long id) {
        userService.restablecerContrasena(id);
        return ResponseEntity.ok(ApiResponse.success(HttpStatus.OK, "Contraseña restablecida exitosamente", null));
    }
}