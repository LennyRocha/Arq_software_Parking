package utez.edu.mx.backendparking.modules.cajon.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.backendparking.modules.cajon.model.Cajon;
import utez.edu.mx.backendparking.modules.cajon.model.CajonDto;
import utez.edu.mx.backendparking.modules.cajon.service.CajonService;
import utez.edu.mx.backendparking.shared.api.ApiResponse;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cajones")
@Tag(name="Cajones", description = "Endpoints REST para cajones")
public class CajonController {
    @Autowired
    private CajonService cajonService;

    @GetMapping
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
    public ApiResponse<List<Cajon>> getAllCajones(
            @RequestParam(defaultValue = "0") int piso,
            @RequestParam(defaultValue = "0") int id
    ) {
        return cajonService.getCajones(piso, id);
    }

    @GetMapping("/id/{id}")
    public ApiResponse<Cajon> getCajonById(@PathVariable("id") Long id) {
        return cajonService.getCajonPorId(id);
    }

    @GetMapping("/name/{name}")
    public ApiResponse<Cajon> getCajonByName(@PathVariable("name") String name) {
        return cajonService.getCajonPorIdentificador(name);
    }

    @GetMapping("/location/{ubi}")
    public ApiResponse<Cajon> getCajonByUbicacion(@PathVariable("ubi") String ubi) {
        return cajonService.getCajonPorUbicacion(ubi);
    }

    @PostMapping
    public ApiResponse<Cajon> crearCajon (@RequestBody CajonDto cajon) {
        return cajonService.createCajon(cajon);
    }

    @PostMapping("/varios")
    public ApiResponse<List<Cajon>> crearCajones (@RequestBody List<CajonDto> cajones) {
        return cajonService.createCajones(cajones);
    }

    @PutMapping("/{id}")
    public ApiResponse<Cajon> actualizarCajon (@PathVariable Long id, @RequestBody CajonDto cajon) {
        return cajonService.updateCajon(id, cajon);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Cajon> deshabilitarCajon (@PathVariable Long id) {
        return cajonService.deleteCajon(id);
    }

    @PutMapping("/reservar")
    public ApiResponse<List<Cajon>> reservarCajones(@RequestBody int conteo) {
        return cajonService.setCajonesExclusivos(conteo);
    }
}
