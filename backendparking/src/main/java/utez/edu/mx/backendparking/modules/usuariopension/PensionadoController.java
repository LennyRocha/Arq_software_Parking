package utez.edu.mx.backendparking.modules.usuariopension;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import utez.edu.mx.backendparking.modules.usuariopension.dto.PensionadoRegistrationDto;
import utez.edu.mx.backendparking.modules.usuariopension.dto.PensionadoResponseDto;
import utez.edu.mx.backendparking.shared.api.ApiResponse;

@RestController
@RequestMapping("/api/pensionado")
@Tag(name = "Registro de Pensionados", description = "Endpoints para el registro completo de usuarios pensionados")
public class PensionadoController {

    private final PensionadoService pensionadoService;

    public PensionadoController(PensionadoService pensionadoService) {
        this.pensionadoService = pensionadoService;
    }

    @PostMapping("/public/registro")
    @Operation(summary = "Registrarse publico como nuevo pensionado", description = "Registro desde la landing page")
    public ResponseEntity<ApiResponse<PensionadoResponseDto>> registrarPensionado(@RequestBody @Valid PensionadoRegistrationDto dto) {

        PensionadoResponseDto response = pensionadoService.registrarseComoPensionado(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(HttpStatus.CREATED, "Pensionado registrado exitosamente", response));
    }
}
