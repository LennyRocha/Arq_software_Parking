package utez.edu.mx.backendparking.modules.tarifa;

import org.springframework.stereotype.Service;
import utez.edu.mx.backendparking.modules.tarifa.dto.TarifaRequestDto;
import utez.edu.mx.backendparking.modules.tarifa.dto.TarifaResponseDto;
import utez.edu.mx.backendparking.modules.tarifa.dto.TarifaUpdateRequestDto;
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
    public List<TarifaResponseDto> findAll() {
        return tarifaRepository.findAll()
                .stream()
                .map(TarifaMapper::toResponseDto)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public List<TarifaResponseDto> findAllActiveOrderByTipoVehiculoAndTiempo() {
        return tarifaRepository.findByEstatusOrderByTipoVehiculoNombreAscTiempoAsc(true)
                .stream()
                .map(TarifaMapper::toResponseDto)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public TarifaResponseDto findById(Long id) {
        Tarifa tarifa = tarifaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(TarifaMessages.ERROR_TARIFA_NOT_FOUND));

        return  TarifaMapper.toResponseDto(tarifa);
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
    public boolean changeStatus(Long id) {
        Tarifa tarifa = tarifaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(TarifaMessages.ERROR_TARIFA_NOT_FOUND));

        tarifa.setEstatus(!tarifa.getEstatus());
        tarifaRepository.save(tarifa);
        return tarifa.getEstatus();
    }

    @Override
    public TarifaResponseDto update(TarifaUpdateRequestDto dto) {
        // Buscar la tarifa existente
        Tarifa tarifa = tarifaRepository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException(TarifaMessages.ERROR_TARIFA_NOT_FOUND));

        // Validar que no exista otra tarifa con la misma combinación (si se están cambiando estos valores)
        if (dto.getTiempo() != null && dto.getTipoVehiculo() != null) {
            boolean exists = tarifaRepository.existsByTiempoAndTipoVehiculo(dto.getTiempo(), dto.getTipoVehiculo());
            // Solo lanzar error si existe y no es la misma tarifa que estamos actualizando
            if (exists && (!tarifa.getTiempo().equals(dto.getTiempo()) || !tarifa.getTipoVehiculo().equals(dto.getTipoVehiculo()))) {
                throw new ConflictException(TarifaMessages.ERROR_TARIFA_DUPLICADA);
            }
        }

        // Actualizar los campos
        TarifaMapper.toUpdateEntity(tarifa, dto);
        tarifaRepository.save(tarifa);

        return TarifaMapper.toResponseDto(tarifa);
    }
}
