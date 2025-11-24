package utez.edu.mx.backendparking.modules.vehiculo.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.backendparking.modules.vehiculo.model.Vehiculo;
import utez.edu.mx.backendparking.modules.vehiculo.model.VehiculoDto;
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
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) Boolean placas
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
}
