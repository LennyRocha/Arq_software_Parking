package utez.edu.mx.backendparking.modules.tarifa;

import org.springframework.stereotype.Service;
import utez.edu.mx.backendparking.modules.tarifa.dto.TarifaRequestDto;
import utez.edu.mx.backendparking.modules.tarifa.dto.TarifaResponseDto;
import utez.edu.mx.backendparking.shared.exception.ConflictException;
import utez.edu.mx.backendparking.shared.exception.ResourceNotFoundException;

import java.util.List;

@Service
public class TarifaServiceImpl implements TarifaService {

    private final TarifaRepository tarifaRepository;

    public TarifaServiceImpl(TarifaRepository tarifaRepository) {
        this.tarifaRepository = tarifaRepository;
    }

    @Override
    public TarifaResponseDto create(TarifaRequestDto dto) {
        // No puede existir una tarifa con la misma combinación de tiempo y tipo de vehículo
        if (tarifaRepository.existsByTiempoAndTipoVehiculo(dto.getTiempo(), dto.getTipoVehiculo())) {
            throw new ConflictException(TarifaMessages.ERROR_TARIFA_DUPLICADA);
        }

        Tarifa tarifa = TarifaMapper.toEntity(dto);
        tarifaRepository.save(tarifa);

        return TarifaMapper.toResponseDto(tarifa);
    }

    @Override
    public List<TarifaResponseDto> findAll() {
        return List.of();
    }

    @Override
    public boolean changeStatus(Long id) {
        Tarifa tarifa = tarifaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(TarifaMessages.ERROR_TARIFA_NOT_FOUND));

        tarifa.setEstatus(!tarifa.getEstatus());
        tarifaRepository.save(tarifa);

        return tarifa.getEstatus();
    }
}
