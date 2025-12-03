package utez.edu.mx.backendparking.modules.tarifa;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import utez.edu.mx.backendparking.modules.tarifa.dto.TarifaRequestDto;
import utez.edu.mx.backendparking.modules.tarifa.dto.TarifaResponseDto;
import utez.edu.mx.backendparking.modules.tarifa.dto.TarifaUpdateRequestDto;
import utez.edu.mx.backendparking.shared.api.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/tarifa")
@Tag(name="Tipos de tarifas", description = "Endpoints para tipos de tarifas")
public class TarifaController {

    private final TarifaService tarifaService;

    public TarifaController(TarifaService tarifaService) {
        this.tarifaService = tarifaService;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener tarifa por id",description="Obtener una tarifa buscandola por su id")
    public ResponseEntity<ApiResponse<TarifaResponseDto>> findById(@PathVariable Long id) {
        TarifaResponseDto tarifa = tarifaService.findById(id);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(HttpStatus.OK, TarifaMessages.ENDPOINT_TARIFA_GET_BY_ID, tarifa));
    }

    @GetMapping
    @Operation(summary = "Obtener todas las tarifas",description="Obtener todos los tipos de tarifas que el sistema maneja")
    public ResponseEntity<ApiResponse<List<TarifaResponseDto>>> findAll() {
        List<TarifaResponseDto> tarifas = tarifaService.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(HttpStatus.OK, TarifaMessages.ENDPOINT_TARIFA_GET_ALL, tarifas));
    }

    @GetMapping("/active")
    @Operation(summary = "Obtener tarifas activas ordenadas", description = "Obtener todas las tarifas activas ordenadas por tipo de vehículo y tiempo ascendente")
    public ResponseEntity<ApiResponse<List<TarifaResponseDto>>> findAllActiveOrderByTipoVehiculoAndTiempo() {
        List<TarifaResponseDto> tarifas = tarifaService.findAllActiveOrderByTipoVehiculoAndTiempo();
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(HttpStatus.OK, TarifaMessages.ENDPOINT_TARIFA_GET_ALL_ACTIVE, tarifas));
    }


    @GetMapping("/search/paginated")
    @Operation(summary = "Buscar tarifas con filtros, ordenamiento y paginación",
               description = "Buscar tarifas por tiempo y/o costo con ordenamiento personalizable y paginación. " +
                             "Por defecto ordena por tipo de vehículo y tiempo ascendente. " +
                             "Parámetros: tiempo (opcional), costo (opcional), sortBy (tipoVehiculo|tiempo|costo), " +
                             "sortOrder (asc|desc), page (número de página, inicia en 0), size (tamaño de página)")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<TarifaResponseDto>>> searchAndSortPaginated(
            @RequestParam(required = false) Double search,
            @RequestParam(required = false, defaultValue = "tipoVehiculo") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortOrder,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<TarifaResponseDto> tarifas = tarifaService.searchAndSortPaginated(search, sortBy, sortOrder, page, size);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(HttpStatus.OK, TarifaMessages.ENDPOINT_TARIFA_SEARCH, tarifas));
    }


    @GetMapping("/public/search/paginated")
    @Operation(summary = "Buscar tarifas con filtros, ordenamiento y paginación",
            description = "Buscar tarifas por tiempo y/o costo con ordenamiento personalizable y paginación. " +
                    "Por defecto ordena por tipo de vehículo y tiempo ascendente. " +
                    "Parámetros: tiempo (opcional), costo (opcional), sortBy (tipoVehiculo|tiempo|costo), " +
                    "sortOrder (asc|desc), page (número de página, inicia en 0), size (tamaño de página)")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<TarifaResponseDto>>> publicsearchAndSortPaginated(
            @RequestParam(required = false) Double search,
            @RequestParam(required = false, defaultValue = "tipoVehiculo") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortOrder,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<TarifaResponseDto> tarifas = tarifaService.searchAndSortPaginated(search, sortBy, sortOrder, page, size);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(HttpStatus.OK, TarifaMessages.ENDPOINT_TARIFA_SEARCH, tarifas));
    }


    @PostMapping
    @Operation(summary = "Crear tipo de tarifa",description="Crear un nuevo tipo de tarifa en el sistema")
    public ResponseEntity<ApiResponse<TarifaResponseDto>> create(@RequestBody @Valid TarifaRequestDto dto) {
        TarifaResponseDto tarifa = tarifaService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(HttpStatus.CREATED, TarifaMessages.ENDPOINT_TARIFA_POST, tarifa));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Cambiar estado de tarifa", description = "Cambiar el estado (activo/inactivo) de una tarifa")
    public ResponseEntity<ApiResponse<Void>> changeStatus(@PathVariable Long id) {

        boolean estado = tarifaService.changeStatus(id);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(HttpStatus.OK,
                estado ? TarifaMessages.ENDPOINT_TARIFA_CHANGE_STATUS_ON : TarifaMessages.ENDPOINT_TARIFA_CHANGE_STATUS_OFF, null));
    }

    @PutMapping("")
    @Operation(summary = "Actualizar tarifa", description = "Actualizar los datos de una tarifa existente")
    public ResponseEntity<ApiResponse<TarifaResponseDto>> update(@RequestBody @Valid TarifaUpdateRequestDto dto) {
        TarifaResponseDto tarifa = tarifaService.update(dto);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(HttpStatus.OK, TarifaMessages.ENDPOINT_TARIFA_PUT_UPDATE, tarifa));
    }
}
