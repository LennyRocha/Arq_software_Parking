package utez.edu.mx.backendparking.modules.tarifa;

import jakarta.validation.ConstraintViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.backendparking.modules.tarifa.dto.TarifaRequestDto;
import utez.edu.mx.backendparking.modules.tarifa.dto.TarifaResponseDto;
import utez.edu.mx.backendparking.modules.tarifa.dto.TarifaUpdateRequestDto;
import utez.edu.mx.backendparking.shared.exception.ConflictException;
import utez.edu.mx.backendparking.shared.exception.ResourceNotFoundException;

import java.sql.SQLException;
import java.util.List;

@Service
public class TarifaServiceImpl implements TarifaService {

    private final TarifaRepository tarifaRepository;

    public TarifaServiceImpl(TarifaRepository tarifaRepository) {
        this.tarifaRepository = tarifaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TarifaResponseDto> findAll() {
        return tarifaRepository.findAll()
                .stream()
                .map(TarifaMapper::toResponseDto)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TarifaResponseDto> findAllActiveOrderByTipoVehiculoAndTiempo() {
        return tarifaRepository.findByEstatusOrderByTipoVehiculoNombreAscTiempoAsc(true)
                .stream()
                .map(TarifaMapper::toResponseDto)
                .collect(java.util.stream.Collectors.toList());
    }


    @Override
    @Transactional(readOnly = true)
    public Page<TarifaResponseDto> searchAndSortPaginated(Double search, String sortBy, String sortOrder, int page, int size) {
        // 1. Crear el objeto Sort según los parámetros
        Sort sort;

        if (sortBy == null || sortBy.isEmpty() || sortBy.equalsIgnoreCase("tipovehiculo")) {
            // Por defecto: ordenar por tipo de vehículo y luego por tiempo
            Sort.Direction direction = "desc".equalsIgnoreCase(sortOrder) ? Sort.Direction.DESC : Sort.Direction.ASC;
            sort = Sort.by(direction, "tipoVehiculo.nombre").and(Sort.by(direction, "tiempo"));
        } else if (sortBy.equalsIgnoreCase("tiempo")) {
            // Ordenar por tiempo
            Sort.Direction direction = "desc".equalsIgnoreCase(sortOrder) ? Sort.Direction.DESC : Sort.Direction.ASC;
            sort = Sort.by(direction, "tiempo");
        } else if (sortBy.equalsIgnoreCase("costo")) {
            // Ordenar por costo
            Sort.Direction direction = "desc".equalsIgnoreCase(sortOrder) ? Sort.Direction.DESC : Sort.Direction.ASC;
            sort = Sort.by(direction, "costo");
        } else {
            // Por defecto si el sortBy no es reconocido: tipo de vehículo y tiempo ascendente
            sort = Sort.by(Sort.Direction.ASC, "tipoVehiculo.nombre").and(Sort.by(Sort.Direction.ASC, "tiempo"));
        }

        // 2. Crear el objeto Pageable con paginación y ordenamiento
        Pageable pageable = PageRequest.of(page, size, sort);

        // 3. Obtener resultados paginados directamente de la base de datos
        Page<Tarifa> tarifasPage;

        if (search == null) {
            // Si no hay búsqueda, traer todos los registros paginados
            tarifasPage = tarifaRepository.findAll(pageable);
        } else {
            // Si hay búsqueda, filtrar por término de búsqueda
            tarifasPage = tarifaRepository.findByFiltersPaginated(search, pageable);
        }

        // 4. Convertir a DTOs usando map
        return tarifasPage.map(TarifaMapper::toResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public TarifaResponseDto findById(Long id) {
        Tarifa tarifa = tarifaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(TarifaMessages.ERROR_TARIFA_NOT_FOUND));

        return  TarifaMapper.toResponseDto(tarifa);
    }

    @Override
    @Transactional(rollbackFor = {SQLException.class, ConstraintViolationException.class})
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
    @Transactional(rollbackFor = {SQLException.class, ConstraintViolationException.class})
    public boolean changeStatus(Long id) {
        Tarifa tarifa = tarifaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(TarifaMessages.ERROR_TARIFA_NOT_FOUND));

        tarifa.setEstatus(!tarifa.getEstatus());
        tarifaRepository.save(tarifa);
        return tarifa.getEstatus();
    }

    @Override
    @Transactional(rollbackFor = {SQLException.class, ConstraintViolationException.class})
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
