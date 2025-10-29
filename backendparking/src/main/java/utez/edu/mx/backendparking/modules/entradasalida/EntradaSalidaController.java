package utez.edu.mx.backendparking.modules.entradasalida;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/entrada-salida")
@Tag(name="Entradas y salidas", description = "Endpoints para entradas y salidas de vehículos")
public class EntradaSalidaController {

    private final EntradaSalidaService entradaSalidaService;

    public EntradaSalidaController(EntradaSalidaService entradaSalidaService) {
        this.entradaSalidaService = entradaSalidaService;
    }
}
