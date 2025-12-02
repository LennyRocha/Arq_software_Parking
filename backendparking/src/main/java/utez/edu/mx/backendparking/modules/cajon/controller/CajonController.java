package utez.edu.mx.backendparking.modules.cajon.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.backendparking.modules.cajon.model.Cajon;
import utez.edu.mx.backendparking.modules.cajon.model.CajonDto;
import utez.edu.mx.backendparking.modules.cajon.service.CajonService;
import utez.edu.mx.backendparking.shared.api.ApiResponse;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cajones")
@Tag(name="Cajones", description = "Endpoints REST para cajones")
public class CajonController {
    @Autowired
    private CajonService cajonService;

    @GetMapping
    @Operation(summary = "Obtener cajones para el admin",
            description = "Este endpoint devuelve todos los cajones registrados en páginas para el administrador")
    public ApiResponse<Map<String, Object>> getAllCajones(
            @RequestParam(defaultValue = "") String sort,
            @RequestParam(defaultValue = "") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        return cajonService.getCajonesPaginated(sort, query, page, pageSize);
    }

    //Solo para pruebas, luego se quitará
    @GetMapping("/all")
    @Operation(summary = "Endpoint del webSocket",
            description = "Endpoint exclsuivo para su uso por webSocket, por lo tanto sólo puede ser consumido por el servidor de socket.io")
    @CrossOrigin(origins = "http://localhost:5000")
    public ApiResponse<List<Cajon>> getAllCajones(
            @RequestParam(defaultValue = "0") int piso,
            @RequestParam(defaultValue = "0") int id
    ) {
        return cajonService.getCajones(piso, id);
    }

    @GetMapping("/id/{id}")
    @Operation(summary = "Obtener un cajón por su id",
            description = "Este endpoint es utilizado para obtener un cajón en especifico por su id")
    public ApiResponse<Cajon> getCajonById(@PathVariable("id") Long id) {
        return cajonService.getCajonPorId(id);
    }

    @GetMapping("/name/{name}")
    @Operation(summary = "Obtener un cajón por su id",
            description = "Este endpoint es utilizado para obtener un cajón en especifico por su identificador")
    public ApiResponse<Cajon> getCajonByName(@PathVariable("name") String name) {
        return cajonService.getCajonPorIdentificador(name);
    }

    @GetMapping("/location/{ubi}")
    @Operation(summary = "Obtener un cajón por su id",
            description = "Este endpoint es utilizado para obtener un cajón en especifico por su ubicación")
    public ApiResponse<Cajon> getCajonByUbicacion(@PathVariable("ubi") String ubi) {
        return cajonService.getCajonPorUbicacion(ubi);
    }

    @GetMapping("/contar")
    @Operation(summary = "Contar cajones que no son para pensionados",
            description = "Este endpoint es utilizado para que el admin vea cuantos cajones hay que no son para pensionados")
    public ApiResponse<Integer> countThem () {
        return cajonService.getAvailableCount();
    }

    @PostMapping
    @Operation(summary = "Registrar un cajón",
            description = "Este endpoint es utilizado para registrar un cajón")
    public ApiResponse<Cajon> crearCajon (@Valid @RequestBody CajonDto cajon) {
        return cajonService.createCajon(cajon);
    }

    @PostMapping("/varios")
    @Operation(summary = "Registrar muchos cajones",
            description = "Este endpoint es utilizado para registrar más de un cajón a la vez")
    public ApiResponse<List<Cajon>> crearCajones (@Valid @RequestBody List<CajonDto> cajones) {
        return cajonService.createCajones(cajones);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un cajón",
            description = "Este endpoint es utilizado para actualizar un cajón")
    public ApiResponse<Cajon> actualizarCajon (@Valid @PathVariable Long id, @RequestBody CajonDto cajon) {
        return cajonService.updateCajon(id, cajon);
    }

    @PutMapping("/reservar")
    @Operation(summary = "Reservar cajones para su uso de pensionados",
            description = "Este endpoint es utilizado para reservar un cierto número de cajones para que los usuarios pensionados los utilicen")
    public ApiResponse<List<Cajon>> reservarCajones(@RequestBody int conteo) {
        return cajonService.setCajonesExclusivos(conteo);
    }

    @PatchMapping("/ocupar/{id_tipo}")
    @Operation(summary = "Ocupar un cajón normal",
            description = "Este endpoint es utilizado para ocupar un cajón al marcar una entrada o una salida")
    public ApiResponse<Cajon> ocuparUnCajon(@RequestParam(defaultValue = "true") boolean entrada, @PathVariable int id_tipo) {
        return cajonService.cambiarDisponibilidad(entrada, id_tipo);
    }

    @PatchMapping("/ocupar/pensionados/{id_tipo}")
    @Operation(summary = "Ocupar un cajón exclusivo para pensionados",
            description = "Este endpoint es utilizado para ocupar un cajón al marcar una entrada o una salida para un usuario pensionado")
    public ApiResponse<Cajon> ocuparUnCajonPensionados(@RequestParam(defaultValue = "true") boolean entrada, @PathVariable int id_tipo) {
        return cajonService.cambiarDisponibilidadForPensionados(entrada, id_tipo);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deshabilitar un cajón",
            description = "Este endpoint es utilizado para deshabilitar un cajón")
    public ApiResponse<Cajon> deshabilitarCajon (@PathVariable Long id) {
        return cajonService.deleteCajon(id);
    }
}
