package utez.edu.mx.backendparking.modules.entradasalida;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaCreatePensionadoRequestDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaCreateVisitanteRequestDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaResponseDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.ReporteGananciasResponseDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.ReporteGananciasTotalesResponseDto;
import utez.edu.mx.backendparking.shared.api.ApiResponse;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/entrada-salida")
@Tag(name="Entradas y salidas", description = "Endpoints para entradas y salidas de vehículos")
public class EntradaSalidaController {

    private final EntradaSalidaService entradaSalidaService;

    public EntradaSalidaController(EntradaSalidaService entradaSalidaService) {
        this.entradaSalidaService = entradaSalidaService;
    }

    @GetMapping("/search/paginated")
    @Operation(summary = "Buscar y paginar entradas y salidas",
            description = "Busca entradas y salidas por folio o nombre completo del usuario (nombre + apellidos). " +
                    "Permite ordenar por fecha y hora de entrada (descendente por defecto) o por tipo de vehículo. " +
                    "Soporta paginación con parámetros de página y tamaño.")
    public ResponseEntity<ApiResponse<Page<EntradaSalidaResponseDto>>> searchAndSortPaginated(
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "fecha") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortOrder,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<EntradaSalidaResponseDto> resultado = entradaSalidaService.searchAndSortPaginated(search, sortBy, sortOrder, page, size);
        return ResponseEntity.ok()
                .body(ApiResponse.success(HttpStatus.OK, EntradaSalidaMessages.ENDPOINT_ENTRADA_SALIDA_GET_ALL, resultado));
    }

    @GetMapping("/pensionado/search/paginated")
    @Operation(summary = "Buscar y paginar entradas y salidas del pensionado autenticado",
            description = "Busca las entradas y salidas del usuario pensionado autenticado por folio. " +
                    "Permite ordenar por fecha y hora de entrada (descendente por defecto) o por tipo de vehículo. " +
                    "Soporta paginación con parámetros de página y tamaño. " +
                    "Utiliza el token JWT para identificar al usuario automáticamente.")
    public ResponseEntity<ApiResponse<Page<EntradaSalidaResponseDto>>> searchAndSortPaginatedByPensionado(
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "fecha") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortOrder,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<EntradaSalidaResponseDto> resultado = entradaSalidaService.searchAndSortPaginatedByPensionado(search, sortBy, sortOrder, page, size);
        return ResponseEntity.ok()
                .body(ApiResponse.success(HttpStatus.OK, EntradaSalidaMessages.ENDPOINT_ENTRADA_SALIDA_GET_ALL, resultado));
    }

    @GetMapping("/get-by-id/{id}")
    @Operation(summary = "Obtener entrada/salida por ID",
            description = "Obtiene los detalles completos de un registro de entrada/salida específico mediante su ID.")
    public ResponseEntity<ApiResponse<EntradaSalidaResponseDto>> findById(@PathVariable Long id) {
        EntradaSalidaResponseDto entradaSalida = entradaSalidaService.findById(id);
        return ResponseEntity.ok()
                .body(ApiResponse.success(HttpStatus.OK, EntradaSalidaMessages.ENDPOINT_ENTRADA_SALIDA_GET_BY_ID, entradaSalida));
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

    @GetMapping("/visitante/salida-datos/{folioTicket}")
    @Operation(summary = "Obtener datos de salida de visitante",
               description = "Obtiene los datos de salida de un visitante incluyendo la hora de salida actual y el monto a pagar " +
                             "calculado según las tarifas configuradas para el tipo de vehículo. " +
                             "Este endpoint NO guarda los datos en la base de datos, solo los retorna para su visualización.")
    public ResponseEntity<ApiResponse<EntradaSalidaResponseDto>> solicitarDatosSalidaVisitante(@PathVariable Integer folioTicket) {
        EntradaSalidaResponseDto entradaSalida = entradaSalidaService.solicitarDatosSalidaVisitante(folioTicket);
        return ResponseEntity.ok()
                .body(ApiResponse.success(HttpStatus.OK, EntradaSalidaMessages.ENDPOINT_ENTRADA_SALIDA_SALIDA_DATOS, entradaSalida));
    }

    @PutMapping("/visitante/salida/{folioTicket}")
    @Operation(summary = "marcar salida de visitante",
            description = "Marca la salida de un vehículo visitante del estacionamiento. " +
                    "Calcula y guarda la hora de salida y el monto a pagar en la base de datos según las tarifas configuradas para el tipo de vehículo.")
    public ResponseEntity<ApiResponse<EntradaSalidaResponseDto>> marcarSalidaVisitante(@PathVariable Integer folioTicket) {
        EntradaSalidaResponseDto entradaSalida = entradaSalidaService.marcarSalidaVisitante(folioTicket);
        return ResponseEntity.ok()
                .body(ApiResponse.success(HttpStatus.OK, EntradaSalidaMessages.ENDPOINT_ENTRADA_SALIDA_REGISTRAR_SALIDA, entradaSalida));
    }

    @GetMapping("/pensionado/salida-datos/{uuidCodigoQR}")
    @Operation(summary = "Obtener datos de salida de pensionado",
            description = "Obtiene los datos de salida de un visitante incluyendo la hora de salida actual y el monto a pagar " +
                    "calculado según las tarifas configuradas para el tipo de vehículo. " +
                    "Este endpoint NO guarda los datos en la base de datos, solo los retorna para su visualización.")
    public ResponseEntity<ApiResponse<EntradaSalidaResponseDto>> solicitarDatosSalidaPensionado(@PathVariable String uuidCodigoQR) {
        EntradaSalidaResponseDto entradaSalida = entradaSalidaService.solicitarDatosSalidaPensionado(uuidCodigoQR);
        return ResponseEntity.ok()
                .body(ApiResponse.success(HttpStatus.OK, EntradaSalidaMessages.ENDPOINT_ENTRADA_SALIDA_SALIDA_DATOS, entradaSalida));
    }

    @PutMapping("/pensionado/salida/{uuidCodigoQR}")
    @Operation(summary = "Marcar salida de pensionado",
            description = "Marca la salida de un vehículo pensionado del estacionamiento. " +
                    "Calcula y guarda la hora de salida.")
    public ResponseEntity<ApiResponse<EntradaSalidaResponseDto>> marcarSalidaPensionado(@PathVariable String uuidCodigoQR) {
        EntradaSalidaResponseDto entradaSalida = entradaSalidaService.marcarSalidaPensionado(uuidCodigoQR);
        return ResponseEntity.ok()
                .body(ApiResponse.success(HttpStatus.OK, EntradaSalidaMessages.ENDPOINT_ENTRADA_SALIDA_REGISTRAR_SALIDA, entradaSalida));
    }

    @GetMapping("/reportes/ganancias-por-hora")
    @Operation(summary = "Generar reporte de ganancias por hora",
            description = "Genera un reporte de ganancias desglosado por hora para una o varias fechas. " +
                    "Si no se especifican fechas, genera el reporte para TODAS las fechas con registros en la base de datos. " +
                    "Si se especifica solo fechaInicial, genera el reporte solo para esa fecha. " +
                    "Si se especifican ambas fechas, genera el reporte para el rango de fechas. " +
                    "Calcula las ganancias de visitantes (basado en cantidadPago de EntradaSalida) y " +
                    "pensionados (basado en HistorialPagos). Retorna una lista con 24 registros por cada fecha (0-23 horas) " +
                    "con las ganancias totales por hora. Soporta paginación y ordenamiento ascendente/descendente.")
    public ResponseEntity<ApiResponse<Page<ReporteGananciasResponseDto>>> generarReporteGananciasPorHora(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicial,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFinal,
            @RequestParam(required = false, defaultValue = "desc") String sortOrder,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<ReporteGananciasResponseDto> reporte = entradaSalidaService.generarReporteGananciasPorHora(fechaInicial, fechaFinal, sortOrder, page, size);
        return ResponseEntity.ok()
                .body(ApiResponse.success(HttpStatus.OK, EntradaSalidaMessages.ENDPOINT_REPORTE_GANANCIAS_POR_HORA, reporte));
    }

    @GetMapping("/reportes/ganancias-totales")
    @Operation(summary = "Generar reporte de ganancias totales",
            description = "Genera un reporte con las ganancias totales del sistema en un rango de fechas especificado. " +
                    "Si no se especifican fechas, genera el reporte para TODAS las fechas con registros en la base de datos. " +
                    "Si se especifica solo fechaInicial, genera el reporte solo para esa fecha. " +
                    "Si se especifican ambas fechas, genera el reporte para el rango de fechas. " +
                    "Calcula las ganancias de visitantes (basado en cantidadPago de EntradaSalida) y " +
                    "pensionados (basado en HistorialPagos). Retorna un objeto único con el resumen total de ganancias.")
    public ResponseEntity<ApiResponse<ReporteGananciasTotalesResponseDto>> generarReporteGananciasTotales(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicial,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFinal) {

        ReporteGananciasTotalesResponseDto reporte = entradaSalidaService.generarReporteGananciasTotales(fechaInicial, fechaFinal);
        return ResponseEntity.ok()
                .body(ApiResponse.success(HttpStatus.OK, EntradaSalidaMessages.ENDPOINT_REPORTE_GANANCIAS_TOTALES, reporte));
    }

    @PutMapping("/actualizar-datos/{id}")
    @Operation(summary = "Actualizar datos de entrada/salida de un visitante",
            description = "Registra la entrada de un vehículo visitante al estacionamiento. " +
                    "Si se especifica un vehículo, toma su tipo de vehículo; si no, usa el tipo de vehículo especificado directamente. " +
                    "Solo sirve para modificar los datos de entrada de un visitante ya registrado.")
    public ResponseEntity<ApiResponse<EntradaSalidaResponseDto>> actualizarDatosEntradaSalida(
            @PathVariable Long id,
            @RequestBody @Valid EntradaSalidaCreateVisitanteRequestDto dto) {
        EntradaSalidaResponseDto entradaSalida = entradaSalidaService.actualizarEntrada(id, dto);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success(HttpStatus.OK, EntradaSalidaMessages.ENDPOINT_ENTRADA_SALIDA_PUT_UPDATE, entradaSalida));
    }

    @GetMapping("/solicitar-codigo")
    @Operation(summary = "Solicitar código de entrada/salida",
            description = "Genera y retorna un nuevo código único para una entrada/salida para el usuario pensionado.")
    public ResponseEntity<ApiResponse<String>> solicitarCodigoEntradaSalida() {
        String codigo = entradaSalidaService.searchCodigoEntradaSalida();
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success(HttpStatus.OK, EntradaSalidaMessages.ENDPOINT_CODIGO_ENTRADA_SALIDA, codigo));
    }

}
