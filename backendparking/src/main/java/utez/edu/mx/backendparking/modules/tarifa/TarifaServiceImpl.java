package utez.edu.mx.backendparking.modules.tarifa;

import jakarta.validation.ConstraintViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.backendparking.modules.tarifa.dto.TarifaRequestDto;
import utez.edu.mx.backendparking.modules.tarifa.dto.TarifaResponseDto;
import utez.edu.mx.backendparking.modules.tarifa.dto.TarifaUpdateRequestDto;
import utez.edu.mx.backendparking.shared.exception.ConflictException;
import utez.edu.mx.backendparking.shared.exception.ResourceNotFoundException;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Comparator;
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
    public Page<TarifaResponseDto> searchAndSortPaginated(Integer tiempo, Double costo, String sortBy, String sortOrder, int page, int size) {
        // Obtener tarifas filtradas
        List<Tarifa> tarifas = tarifaRepository.findByFilters(tiempo, costo);

        // Determinar el comparador según el campo de ordenamiento usando lambdas
        Comparator<Tarifa> comparator;

        if (sortBy == null || sortBy.isEmpty()) {
            sortBy = "tipoVehiculo"; // Por defecto
        }

        String sortByLower = sortBy.toLowerCase();

        if (sortByLower.equals("tipovehiculo")) {
            // Lambda que compara por nombre de tipo de vehículo, y luego por tiempo
            comparator = (t1, t2) -> {
                int comparacion = t1.getTipoVehiculo().getNombre().compareTo(t2.getTipoVehiculo().getNombre());
                if (comparacion == 0) {
                    return t1.getTiempo().compareTo(t2.getTiempo());
                }
                return comparacion;
            };
        } else if (sortByLower.equals("tiempo")) {
            // Lambda que compara solo por tiempo
            comparator = (t1, t2) -> t1.getTiempo().compareTo(t2.getTiempo());
        } else if (sortByLower.equals("costo")) {
            // Lambda que compara solo por costo
            comparator = (t1, t2) -> t1.getCosto().compareTo(t2.getCosto());
        } else {
            // Por defecto: tipo de vehículo y tiempo
            comparator = (t1, t2) -> {
                int comparacion = t1.getTipoVehiculo().getNombre().compareTo(t2.getTipoVehiculo().getNombre());
                if (comparacion == 0) {
                    return t1.getTiempo().compareTo(t2.getTiempo());
                }
                return comparacion;
            };
        }

        // Aplicar orden descendente si es necesario
        if ("desc".equalsIgnoreCase(sortOrder)) {
            // Lambda que invierte el orden usando el comparador anterior
            Comparator<Tarifa> ascComparator = comparator;
            comparator = (t1, t2) -> ascComparator.compare(t2, t1); // Invertir el orden
        }

        // Ordenar la lista
        tarifas.sort(comparator);

        // Calcular índices para la paginación
        int totalElements = tarifas.size();
        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, totalElements);

        // Validar que la página solicitada existe
        if (fromIndex > totalElements) {
            fromIndex = 0;
            toIndex = 0;
        }

        // Obtener sublista paginada
        List<Tarifa> tarifasPaginadas = tarifas.subList(fromIndex, toIndex);

        // Convertir a DTOs usando un bucle for-each
        List<TarifaResponseDto> resultado = new ArrayList<>();
        for (Tarifa tarifa : tarifasPaginadas) {
            resultado.add(TarifaMapper.toResponseDto(tarifa));
        }

        // Crear objeto Pageable y Page
        Pageable pageable = PageRequest.of(page, size);
        return new PageImpl<>(resultado, pageable, totalElements);
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
