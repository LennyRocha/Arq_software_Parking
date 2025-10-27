package utez.edu.mx.backendparking.modules.tarifa;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.backendparking.modules.pension.PensionMessages;
import utez.edu.mx.backendparking.modules.pension.dto.PensionRequestDto;
import utez.edu.mx.backendparking.modules.pension.dto.PensionResponseDto;
import utez.edu.mx.backendparking.modules.tarifa.dto.TarifaRequestDto;
import utez.edu.mx.backendparking.modules.tarifa.dto.TarifaResponseDto;
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

    @PostMapping
    @Operation(summary = "Crear tipo de tarifa",description="Crear un nuevo tipo de tarifa en el sistema")
    public ResponseEntity<ApiResponse<TarifaResponseDto>> create(@RequestBody @Valid TarifaRequestDto dto) {
        TarifaResponseDto tarifa = tarifaService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(HttpStatus.CREATED, TarifaMessages.ENDPOINT_TARIFA_POST, tarifa));
    }

    @GetMapping
    @Operation(summary = "Obtener todas las tarifas",description="Obtener todos los tipos de tarifas que el sistema maneja")
    public ResponseEntity<ApiResponse<List<TarifaResponseDto>>> findAll() {
        List<TarifaResponseDto> tarifas = tarifaService.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(HttpStatus.OK, TarifaMessages.ENDPOINT_TARIFA_GET_ALL, tarifas));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Void>> changeStatus(@PathVariable Long id) {

        boolean estado = tarifaService.changeStatus(id);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(HttpStatus.OK,
                estado ? TarifaMessages.ENDPOINT_TARIFA_CHANGE_STATUS_ON : TarifaMessages.ENDPOINT_TARIFA_CHANGE_STATUS_OFF, null));
    }
}
