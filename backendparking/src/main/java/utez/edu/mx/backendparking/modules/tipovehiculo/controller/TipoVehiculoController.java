package utez.edu.mx.backendparking.modules.tipovehiculo.controller;

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
public class TipoVehiculoController {

    @Autowired
    private TipoVehiculoService tipoVehiculoService;

    @GetMapping("/backend")
    public List<TipoVehiculo> getAllTipoVehiculos() {
        return tipoVehiculoService.findAll();
    }

    @GetMapping
    public ApiResponse getAllTiposVehiculos() {
        return ApiResponse.success(HttpStatus.OK, "Tipos de vehículo disponibles", tipoVehiculoService.findAll());
    }

    @GetMapping("/{id}")
    public TipoVehiculo getTipoVehiculoById(@PathVariable Integer id) {
        return tipoVehiculoService.findById(id);
    }
}