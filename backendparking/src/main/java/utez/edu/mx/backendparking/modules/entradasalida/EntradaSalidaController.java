package utez.edu.mx.backendparking.modules.entradasalida;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaCreatePensionadoRequestDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaResponseDto;
import utez.edu.mx.backendparking.shared.api.ApiResponse;

@RestController
@RequestMapping("/api/entrada-salida")
@Tag(name="Entradas y salidas", description = "Endpoints para entradas y salidas de vehículos")
public class EntradaSalidaController {

    private final EntradaSalidaService entradaSalidaService;

    public EntradaSalidaController(EntradaSalidaService entradaSalidaService) {
        this.entradaSalidaService = entradaSalidaService;
    }

    @PostMapping("/pensionado")
    @Operation(summary = "Registrar entrada de pensionado",
               description = "Registra la entrada de un vehículo de un usuario pensionado al estacionamiento. " +
                             "Valida que el vehículo pertenezca al usuario, genera un folio único, " +
                             "asigna el monto de pago según el tipo de pensión y verifica si la pensión vence hoy.")
    public ResponseEntity<ApiResponse<EntradaSalidaResponseDto>> createPensionado(@RequestBody @Valid EntradaSalidaCreatePensionadoRequestDto dto) {
        EntradaSalidaResponseDto entradaSalida = entradaSalidaService.createPensionado(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(HttpStatus.CREATED, EntradaSalidaMessages.ENDPOINT_ENTRADA_SALIDA_POST_PENSIONADO, entradaSalida));
    }
}
