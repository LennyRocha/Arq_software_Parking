package utez.edu.mx.backendparking.modules.pension;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
import utez.edu.mx.backendparking.modules.pension.PensionService;
import utez.edu.mx.backendparking.modules.pension.dto.PensionRequestDto;
import utez.edu.mx.backendparking.modules.pension.dto.PensionResponseDto;
import utez.edu.mx.backendparking.shared.api.ApiResponse;
import utez.edu.mx.backendparking.shared.util.PaginationUtils;

import java.util.List;

@RestController
@RequestMapping("/api/pension")
@Tag(name="Tipos de pensión", description = "Endpoints para tipo de pensión")
public class PensionController {

    private final PensionService pensionService;

    public PensionController(PensionService pensionService) {
        this.pensionService = pensionService;
    }

    @PostMapping("/private")
    @Operation(summary = "Crear tipo de pensión",description="Crear un nuevo tipo de pensión en el sistema", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<PensionResponseDto>> create(@RequestBody @Valid PensionRequestDto dto) {
        PensionResponseDto pension = pensionService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(HttpStatus.CREATED, PensionMessages.ENDPOINT_TIPOPENSION_POST, pension));
    }

    @PutMapping("/private/{id}")
    @Operation(summary = "Actualizar tipo de pensión", description = "Actualizar un tipo de pensión existente en el sistema",security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<PensionResponseDto>> update(@PathVariable Long id, @RequestBody @Valid PensionRequestDto dto) {
        PensionResponseDto pension = pensionService.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success(HttpStatus.OK, PensionMessages.ENDPOINT_TIPOPENSION_PUT, pension));
    }

    @PutMapping("/private/{id}/status")
    @Operation(summary = "Cambiar estatus de tipo de pensión", description = "Cambiar estatus de un tipo de pensión existente en el sistema",security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> changeStatus(@PathVariable Long id) {
        pensionService.changeStatus(id);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(HttpStatus.OK, PensionMessages.ENDPOINT_TIPOPENSION_PUT_CHANGE_STATUS, null));
    }

    @GetMapping("/private/paginados")
    @Operation(summary = "Obtener pensiones paginadas", description = "Obtener lista de pensiones con paginación, ordenamiento y búsqueda.",security = @SecurityRequirement(name = "bearerAuth"))
    @Parameter(name = "page", description = "Número de página (0 por defecto)", example = "0")
    @Parameter(name = "size", description = "Tamaño de la página osea resultados (10 por defecto)", example = "10")
    @Parameter(name = "sort", description = "Campo para ordenar. Formato: campo,dirección. Campo por defecto: id,desc", example = "id,desc")
    @Parameter(name = "search", description = "Término de búsqueda (opcional). Busca en: nombre, duración, costo")
    public ResponseEntity<ApiResponse<Page<PensionResponseDto>>> getPensionesPaginados(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort,
            @RequestParam(required = false) String search) {

        String[] sortArray = sort.split(",");
        Sort sortObject = PaginationUtils.getSortFromParams(sortArray);
        Pageable pageable = PageRequest.of(page, size, sortObject);

        Page<PensionResponseDto> pensionesPage = pensionService.findAllPensionesPaginados(pageable, search);

        return ResponseEntity.ok(ApiResponse.success(HttpStatus.OK, PensionMessages.ENDPOINT_TIPOPENSION_GET_ALL, pensionesPage));
    }

    @GetMapping("/public")
    @Operation(summary = "Get para selects frontend",description="Obtener tipo de pensión para selects de frontend. Sin paginado")
    public ResponseEntity<ApiResponse<List<PensionResponseDto>>> findAll() {
        List<PensionResponseDto> pensiones = pensionService.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(HttpStatus.OK, PensionMessages.ENDPOINT_TIPOPENSION_GET_ALL, pensiones));
    }


    @GetMapping("/public/activas/paginados")
    @Operation(summary = "Obtener pensiones activas paginadas", description = "Obtener lista de pensiones activas con paginación, ordenamiento y búsqueda. Para uso público (landing page).")
    @Parameter(name = "page", description = "Número de página (0 por defecto)", example = "0")
    @Parameter(name = "size", description = "Tamaño de la página osea resultados (10 por defecto)", example = "10")
    @Parameter(name = "sort", description = "Campo para ordenar. Formato: campo,dirección. Campo por defecto: id,desc", example = "id,desc")
    @Parameter(name = "search", description = "Término de búsqueda (opcional). Busca en: nombre, duración, costo")
    public ResponseEntity<ApiResponse<Page<PensionResponseDto>>> getPensionesActivasPaginados(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort,
            @RequestParam(required = false) String search) {

        String[] sortArray = sort.split(",");
        Sort sortObject = PaginationUtils.getSortFromParams(sortArray);
        Pageable pageable = PageRequest.of(page, size, sortObject);

        Page<PensionResponseDto> pensionesPage = pensionService.findAllPensionesActivasPaginados(pageable, search);

        return ResponseEntity.ok(ApiResponse.success(HttpStatus.OK, PensionMessages.ENDPOINT_TIPOPENSION_GET_ALL, pensionesPage));
    }

}