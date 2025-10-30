package utez.edu.mx.backendparking.modules.entradasalida;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaCreatePensionadoRequestDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaCreateVisitanteRequestDto;
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

    @PostMapping("/visitante")
    @Operation(summary = "Registrar entrada de visitante",
               description = "Registra la entrada de un vehículo visitante al estacionamiento. " +
                             "Si se especifica un vehículo, toma su tipo de vehículo; si no, usa el tipo de vehículo especificado directamente. " +
                             "Genera automáticamente un folio único, fecha y hora de entrada.")
    public ResponseEntity<ApiResponse<EntradaSalidaResponseDto>> createVisitante(@RequestBody @Valid EntradaSalidaCreateVisitanteRequestDto dto) {
        EntradaSalidaResponseDto entradaSalida = entradaSalidaService.createVisitante(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(HttpStatus.CREATED, EntradaSalidaMessages.ENDPOINT_ENTRADA_SALIDA_POST, entradaSalida));
    }

    @GetMapping("/visitante/salida/{folioTicket}")
    @Operation(summary = "Marcar salida de visitante",
               description = "Obtiene los datos de salida de un visitante incluyendo la hora de salida actual y el monto a pagar " +
                             "calculado según las tarifas configuradas para el tipo de vehículo. " +
                             "Este endpoint NO guarda los datos en la base de datos, solo los retorna para su visualización.")
    public ResponseEntity<ApiResponse<EntradaSalidaResponseDto>> solicitarDatosSalidaVisitante(@PathVariable Integer folioTicket) {
        EntradaSalidaResponseDto entradaSalida = entradaSalidaService.solicitarDatosSalidaVisitante(folioTicket);
        return ResponseEntity.ok()
                .body(ApiResponse.success(HttpStatus.OK, EntradaSalidaMessages.ENDPOINT_ENTRADA_SALIDA_REGISTRAR_SALIDA, entradaSalida));
    }
}
