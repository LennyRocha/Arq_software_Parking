package utez.edu.mx.backendparking.modules.usuariopension;

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
import utez.edu.mx.backendparking.modules.historialpagos.dto.PagoResponseDto;
import utez.edu.mx.backendparking.modules.roles.ERole;
import utez.edu.mx.backendparking.modules.roles.Roles;
import utez.edu.mx.backendparking.modules.usuario.Usuario;
import utez.edu.mx.backendparking.modules.usuariopension.dto.PensionadoRegistrationDto;
import utez.edu.mx.backendparking.modules.usuariopension.dto.PensionadoResponseDto;
import utez.edu.mx.backendparking.modules.usuariopension.dto.RenovarPensionRequestDto;
import utez.edu.mx.backendparking.modules.usuariopension.dto.UsuarioPensionResponseDto;
import utez.edu.mx.backendparking.security.SecurityUtils;
import utez.edu.mx.backendparking.shared.api.ApiResponse;
import utez.edu.mx.backendparking.shared.exception.ConflictException;
import utez.edu.mx.backendparking.shared.util.PaginationUtils;

@RestController
@RequestMapping("/api/pensionado")
@Tag(name = "Usuario pension", description = "Endpoints para el registro completo de usuarios pensionados")
public class PensionadoController {

    private final PensionadoService pensionadoService;

    public PensionadoController(PensionadoService pensionadoService) {
        this.pensionadoService = pensionadoService;
    }

    @PostMapping("/public/registro")
    @Operation(summary = "Registrarse publico como nuevo pensionado", description = "Registro desde la landing page")
    public ResponseEntity<ApiResponse<PensionadoResponseDto>> registrarPensionado(@RequestBody @Valid PensionadoRegistrationDto dto) {

        PensionadoResponseDto response = pensionadoService.registrarseComoPensionado(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(HttpStatus.CREATED, "Pensionado registrado exitosamente", response));
    }


    @GetMapping("/private/paginados")
    @Operation(summary = "Obtener usuarios pensionados paginados", description = "Obtener lista de usuarios pensionados con paginación, ordenamiento y búsqueda.",security = @SecurityRequirement(name = "bearerAuth"))
    @Parameter(name = "page", description = "Número de página (0 por defecto)", example = "0")
    @Parameter(name = "size", description = "Tamaño de la página (10 por defecto)", example = "10")
    @Parameter(name = "sort", description = "Campo para ordenar. Formato: campo,dirección", example = "id,desc")
    @Parameter(name = "search", description = "Término de búsqueda (opcional). Busca en correo y nombre de pensión")
    public ResponseEntity<ApiResponse<Page<UsuarioPensionResponseDto>>> getUsuariosPensionadosPaginados(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id,desc") String sort, @RequestParam(required = false) String search) {

        String[] sortArray = sort.split(",");
        Sort sortObject = PaginationUtils.getSortFromParams(sortArray);
        Pageable pageable = PageRequest.of(page, size, sortObject);

        Page<UsuarioPensionResponseDto> usuariosPensionPage = pensionadoService.findAllUsuariosPensionados(pageable, search);

        return ResponseEntity.ok(ApiResponse.success(HttpStatus.OK, "Usuarios pensionados obtenidos correctamente", usuariosPensionPage));
    }

    @GetMapping("/cliente/mi-pension")
    @Operation(summary = "Obtener pensión del usuario autenticado", description = "Obtener información de la pensión del usuario pensionado autenticado", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<UsuarioPensionResponseDto>> getMiPension() {
        Usuario usuario=SecurityUtils.getCurrentUser();
        ERole role=usuario.getRol().getName();

        if(!role.equals(ERole.CLIENTE_PENSIONADO)){
            throw new ConflictException("Este endpoint es solo para usuarios pensionados");
        }
        Long usuarioId = usuario.getId();

        UsuarioPensionResponseDto pension = pensionadoService.findPensionByUsuarioId(usuarioId);

        return ResponseEntity.ok(ApiResponse.success(HttpStatus.OK, "Pensión obtenida correctamente", pension));
    }

    @GetMapping("/private/historial-pagos/{usuariopensionId}")
    @Operation(summary = "Obtener historial de pagos de un usuario", description = "Obtener el historial de pagos paginado de un usuario específico. Para funciones de admin y empleado",security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Page<PagoResponseDto>>> getHistorialPagos(
            @PathVariable Long usuariopensionId, 
            @RequestParam(defaultValue = "0") int page, 
            @RequestParam(defaultValue = "10") int size, 
            @RequestParam(defaultValue = "fechaPago,desc") String sort,
            @RequestParam(required = false) String search) {

        String[] sortArray = sort.split(",");
        Sort sortObject = PaginationUtils.getSortFromParams(sortArray);
        Pageable pageable = PageRequest.of(page, size, sortObject);

        Page<PagoResponseDto> historialPagos = pensionadoService.findHistorialPagosByUsuarioPension(usuariopensionId, pageable, search);

        return ResponseEntity.ok(ApiResponse.success(HttpStatus.OK, "Historial de pagos obtenido correctamente", historialPagos));
    }

    @GetMapping("/cliente/mi-historial-pagos")
    @Operation(summary = "Obtener historial de pagos del usuario autenticado", description = "Obtener el historial de pagos paginado del usuario pensionado autenticado. Para usuarios pensionados",security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Page<PagoResponseDto>>> getMiHistorialPagos(
            @RequestParam(defaultValue = "0") int page, 
            @RequestParam(defaultValue = "10") int size, 
            @RequestParam(defaultValue = "fechaPago,desc") String sort,
            @RequestParam(required = false) String search) {

        Usuario usuario=SecurityUtils.getCurrentUser();
        ERole role=usuario.getRol().getName();

        if(!role.equals(ERole.CLIENTE_PENSIONADO)){
            throw new ConflictException("Este endpoint es solo para usuarios pensionados");
        }
        Long usuarioId = usuario.getId();

        // Obtener el usuarioPensionId del usuario autenticado
        UsuarioPensionResponseDto pension = pensionadoService.findPensionByUsuarioId(usuarioId);
        Long usuarioPensionId = pension.getId();

        String[] sortArray = sort.split(",");
        Sort sortObject = PaginationUtils.getSortFromParams(sortArray);
        Pageable pageable = PageRequest.of(page, size, sortObject);

        Page<PagoResponseDto> historialPagos = pensionadoService.findHistorialPagosByUsuarioPension(usuarioPensionId, pageable, search);

        return ResponseEntity.ok(ApiResponse.success(HttpStatus.OK, "Historial de pagos obtenido correctamente", historialPagos));
    }

    @PostMapping("/private/{usuarioPensionId}/renovar")
    @Operation(summary = "Renovar pensión de usuario", description = "Renovar la pensión de un usuario específico con un nuevo tipo de pensión.",security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> renovarPension(@PathVariable Long usuarioPensionId, @RequestBody @Valid RenovarPensionRequestDto dto) {

        pensionadoService.renovarPension(usuarioPensionId, dto);

        return ResponseEntity.ok(ApiResponse.success(HttpStatus.OK, "Pensión renovada correctamente", null));
    }


    @PostMapping("/cliente/renovar")
    @Operation(summary = "Renovar pensión del usuario autenticado", description = "Renovar la pensión del usuario pensionado autenticado con un nuevo tipo de pensión",security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> renovarMiPension(@RequestBody @Valid RenovarPensionRequestDto dto) {

        Usuario usuario=SecurityUtils.getCurrentUser();
        ERole role=usuario.getRol().getName();

        if(!role.equals(ERole.CLIENTE_PENSIONADO)){
            throw new ConflictException("Este endpoint es solo para usuarios pensionados");
        }
        Long usuarioId = usuario.getId();

        UsuarioPensionResponseDto pension = pensionadoService.findPensionByUsuarioId(usuarioId);
        // Obtener el usuarioPensionId del usuario autenticado
        Long usuarioPensionId = pension.getId();

        pensionadoService.renovarPension(usuarioPensionId, dto);

        return ResponseEntity.ok(ApiResponse.success(HttpStatus.OK, "Pensión renovada correctamente", null));
    }
}
