package utez.edu.mx.backendparking.modules.entradasalida;

import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaCreateVisitanteRequestDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaResponseDto;

import java.util.List;

public interface EntradaSalidaService {
    EntradaSalidaResponseDto create(EntradaSalidaCreateVisitanteRequestDto dto);
    List<EntradaSalidaResponseDto> findAll();
}
