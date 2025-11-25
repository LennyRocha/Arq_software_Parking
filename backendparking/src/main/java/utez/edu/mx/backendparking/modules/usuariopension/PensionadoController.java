package utez.edu.mx.backendparking.modules.usuariopension;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
import utez.edu.mx.backendparking.modules.usuariopension.dto.PensionadoRegistrationDto;
import utez.edu.mx.backendparking.modules.usuariopension.dto.PensionadoResponseDto;
import utez.edu.mx.backendparking.modules.usuariopension.dto.RenovarPensionRequestDto;
import utez.edu.mx.backendparking.modules.usuariopension.dto.UsuarioPensionResponseDto;
import utez.edu.mx.backendparking.shared.api.ApiResponse;
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
    @Operation(summary = "Obtener usuarios pensionados paginados",
            description = "Obtener lista de usuarios pensionados con paginación, ordenamiento y búsqueda.")
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

    @GetMapping("/private/historial-pagos/{usuariopensionId}")
    @Operation(summary = "Obtener historial de pagos de un usuario",
            description = "Obtener el historial de pagos paginado de un usuario específico.")
    public ResponseEntity<ApiResponse<Page<PagoResponseDto>>> getHistorialPagos(@PathVariable Long usuariopensionId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "fechaPago,desc") String sort) {

        String[] sortArray = sort.split(",");
        Sort sortObject = PaginationUtils.getSortFromParams(sortArray);
        Pageable pageable = PageRequest.of(page, size, sortObject);

        Page<PagoResponseDto> historialPagos = pensionadoService.findHistorialPagosByUsuarioPension(usuariopensionId, pageable);

        return ResponseEntity.ok(ApiResponse.success(HttpStatus.OK, "Historial de pagos obtenido correctamente", historialPagos));
    }

    @PostMapping("/private/{usuarioPensionId}/renovar")
    @Operation(summary = "Renovar pensión de usuario", description = "Renovar la pensión de un usuario específico con un nuevo tipo de pensión.")
    public ResponseEntity<ApiResponse<Void>> renovarPension(@PathVariable Long usuarioPensionId, @RequestBody @Valid RenovarPensionRequestDto dto) {

        pensionadoService.renovarPension(usuarioPensionId, dto);

        return ResponseEntity.ok(ApiResponse.success(HttpStatus.OK, "Pensión renovada correctamente", null));
    }

}
