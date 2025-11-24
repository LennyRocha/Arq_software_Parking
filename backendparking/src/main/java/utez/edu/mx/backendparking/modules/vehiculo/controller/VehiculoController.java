package utez.edu.mx.backendparking.modules.vehiculo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.backendparking.modules.vehiculo.model.Vehiculo;
import utez.edu.mx.backendparking.modules.vehiculo.model.VehiculoDto;
import utez.edu.mx.backendparking.modules.vehiculo.model.VehiculoEstacionadoResponseDto;
import utez.edu.mx.backendparking.modules.vehiculo.model.VehiculoResponseDto;
import utez.edu.mx.backendparking.modules.vehiculo.service.VehiculoService;
import utez.edu.mx.backendparking.shared.api.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/vehiculos")
@Tag(name="Vehículos", description = "Endpoints para vehículos")
public class VehiculoController {

    @Autowired
    private VehiculoService vehiculoService;

    @GetMapping
    public ApiResponse<List<VehiculoDto>> getAllVehiculos() {
        return vehiculoService.getAllVehiculos();
    }

    @GetMapping("/usuario/{userid}")
    public ApiResponse<List<VehiculoDto>> getVehiculoById(
            @PathVariable Long userid,
            @RequestParam(required = false) Integer carid,
            @RequestParam(defaultValue = "") String query,
            @RequestParam(defaultValue = "false") Boolean active,
            @RequestParam(defaultValue = "false") Boolean placas
    ) {
        return vehiculoService.getAllVehiculosPerUser(
                userid,
                carid,
                query,
                active,
                placas
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<Vehiculo> getVehiculoById(@PathVariable Long id) {
        return vehiculoService.getVehiculoById(id);
    }

    @PostMapping
    public ApiResponse<Vehiculo> createVehiculo(@Valid @RequestBody VehiculoDto vehiculoDto) {
        return vehiculoService.createVehiculo(vehiculoDto);
    }

    @PutMapping("/{id}")
    public ApiResponse<Vehiculo> updateVehiculo(@Valid @RequestBody VehiculoDto vehiculoDto, @PathVariable Long id) {
        return vehiculoService.updateVehiculo(id, vehiculoDto);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteVehiculo(@PathVariable Long id) {
        return vehiculoService.deleteVehiculo(id);
    }

    /**
     * Verifica si el usuario autenticado tiene un vehículo estacionado actualmente
     * @return ApiResponse con información del vehículo estacionado si existe
     */
    @GetMapping("/estacionado/verificar")
    @Operation(summary = "Verificar vehículo estacionado",
               description = "Verifica si el usuario autenticado tiene un vehículo estacionado actualmente en el estacionamiento")
    public ApiResponse<VehiculoEstacionadoResponseDto> verificarVehiculoEstacionado() {
        return vehiculoService.verificarVehiculoEstacionado();
    }

    /**
     * Obtiene todos los vehículos del usuario autenticado
     * @return ApiResponse con la lista de vehículos del usuario
     */
    @GetMapping("/mis-vehiculos")
    @Operation(summary = "Obtener mis vehículos",
               description = "Obtiene todos los vehículos registrados del usuario autenticado")
    public ApiResponse<List<VehiculoResponseDto>> getMisVehiculos() {
        return vehiculoService.getMisVehiculos();
    }
}
