package utez.edu.mx.backendparking.modules.tipovehiculo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import utez.edu.mx.backendparking.modules.tipovehiculo.model.TipoVehiculo;
import utez.edu.mx.backendparking.modules.tipovehiculo.service.TipoVehiculoService;
import utez.edu.mx.backendparking.shared.api.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/vehiculos/tipos")
@Tag(name="Tipos de vehículos", description = "Endpoints para tipos de vehículos")
public class TipoVehiculoController {

    @Autowired
    private TipoVehiculoService tipoVehiculoService;

    @GetMapping("/backend")
    @Operation(summary = "Obtener tipos de vehículos",
            description = "Este endpoint es utilizado para obtener los tipos de vehículos con WebClient")
    public List<TipoVehiculo> getAllTipoVehiculos() {
        return tipoVehiculoService.findAll();
    }

    @GetMapping
    @Operation(summary = "Obtener tipos de vehículos",
            description = "Este endpoint es utilizado para obtener los tipos de vehículos en el frontend")
    public ApiResponse getAllTiposVehiculos() {
        return ApiResponse.success(HttpStatus.OK, "Tipos de vehículo disponibles", tipoVehiculoService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un tipo de vehículo",
            description = "Este endpoint es utilizado para obtener un tipo de vehículo con WebClient")
    public TipoVehiculo getTipoVehiculoById(@PathVariable Integer id) {
        return tipoVehiculoService.findById(id);
    }
}