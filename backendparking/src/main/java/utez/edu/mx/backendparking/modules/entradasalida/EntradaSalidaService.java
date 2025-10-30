package utez.edu.mx.backendparking.modules.entradasalida;

import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaCreatePensionadoRequestDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaCreateVisitanteRequestDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaResponseDto;

import java.util.List;

public interface EntradaSalidaService {
    EntradaSalidaResponseDto createPensionado(EntradaSalidaCreatePensionadoRequestDto dto);
    EntradaSalidaResponseDto createVisitante(EntradaSalidaCreateVisitanteRequestDto dto);
    List<EntradaSalidaResponseDto> findAll();
    EntradaSalidaResponseDto marcarSalidaVisitante(Integer folioTicket);
}
