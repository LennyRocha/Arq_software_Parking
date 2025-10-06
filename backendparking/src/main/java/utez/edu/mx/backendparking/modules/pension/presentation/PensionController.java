package utez.edu.mx.backendparking.modules.pension.presentation;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.backendparking.modules.pension.application.PensionService;
import utez.edu.mx.backendparking.modules.pension.presentation.dto.PensionRequestDto;
import utez.edu.mx.backendparking.modules.pension.presentation.dto.PensionResponseDto;
import utez.edu.mx.backendparking.shared.api.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/pension")
public class PensionController {


    private final PensionService pensionService;

    public PensionController(PensionService pensionService) {
        this.pensionService = pensionService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PensionResponseDto>> create(@RequestBody @Valid PensionRequestDto dto) {
        PensionResponseDto pension = pensionService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(HttpStatus.CREATED, "¡Éxito! Tipo de pensión agregado correctamente.", pension));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PensionResponseDto>>> findAll() {
        List<PensionResponseDto> pensiones = pensionService.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(HttpStatus.OK, "Listado de pensiones obtenido correctamente.", pensiones));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Void>> changeStatus(@PathVariable Long id) {
        pensionService.changeStatus(id);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(HttpStatus.OK, "¡Éxito! Estado de la pensión actualizado correctamente.", null));
    }
}

