package utez.edu.mx.backendparking.modules.entradasalida;

import jakarta.validation.ConstraintViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaCreatePensionadoRequestDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaCreateVisitanteRequestDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaResponseDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.ReporteGananciasResponseDto;
import utez.edu.mx.backendparking.modules.tarifa.Tarifa;
import utez.edu.mx.backendparking.modules.tarifa.TarifaMessages;
import utez.edu.mx.backendparking.modules.tarifa.TarifaRepository;
import utez.edu.mx.backendparking.modules.usuario.model.Usuario;
import utez.edu.mx.backendparking.shared.exception.BadRequestException;
import utez.edu.mx.backendparking.shared.exception.ResourceNotFoundException;

import java.sql.SQLException;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class EntradaSalidaServiceImpl implements EntradaSalidaService {

    private final EntradaSalidaRepository entradaSalidaRepository;
    private final TarifaRepository tarifaRepository;

    public EntradaSalidaServiceImpl(EntradaSalidaRepository entradaSalidaRepository, TarifaRepository tarifaRepository) {
        this.entradaSalidaRepository = entradaSalidaRepository;
        this.tarifaRepository = tarifaRepository;
    }

    // COSAS QUE FALTAN POR HACER
    //  1.- Corregir lo comentado
    //  2.- Actualizar el campo de "id_ultima_entrada" en la entidad usuario al momento de hacer una entrada
    //      con un carro especifico de un usuario

    @Override
    @Transactional(readOnly = true)
    public List<EntradaSalidaResponseDto> findAll() {
        return entradaSalidaRepository.findAll()
                .stream()
                .map(EntradaSalidaMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public EntradaSalidaResponseDto findById(Long id) {
        EntradaSalida entradaSalida = entradaSalidaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(EntradaSalidaMessages.ERROR_ENTRADA_SALIDA_NOT_FOUND));

        return EntradaSalidaMapper.toResponseDto(entradaSalida);
    }

    @Override
    @Transactional(rollbackFor = {SQLException.class, ConstraintViolationException.class})
    public EntradaSalidaResponseDto createPensionado(EntradaSalidaCreatePensionadoRequestDto dto) {
        /*
        // 1. Validar que el vehículo le pertenezca al usuario
        if (!dto.getVehiculo().getUsuario().getId().equals(dto.getUsuario().getId())) {
            throw new BadRequestException(EntradaSalidaMessages.ERROR_VEHICULO_NO_PERTENECE_USUARIO);
        }

        // 2. Convertir DTO a entidad usando el mapper
        EntradaSalida entradaSalida = EntradaSalidaMapper.toEntityFromPensionado(dto);

        // 3. Generar folio automático único
        entradaSalida.setFolioTicket(generarFolioUnico());

        // 4. Verificar si la pensión va a caducar en el día en curso
        boolean vencimientoHoy = verificarVencimientoPension(dto.getUsuario());
        entradaSalida.setVencimientoPension(vencimientoHoy);

        // Guardar la entidad
        EntradaSalida savedEntradaSalida = entradaSalidaRepository.save(entradaSalida);

        // Convertir a DTO de respuesta usando el mapper
        return EntradaSalidaMapper.toResponseDto(savedEntradaSalida);
        */
        return null;
    }

    @Override
    @Transactional(rollbackFor = {SQLException.class, ConstraintViolationException.class})
    public EntradaSalidaResponseDto createVisitante(EntradaSalidaCreateVisitanteRequestDto dto) {

        // 1. Convertir DTO a entidad usando el mapper
        // El mapper ya maneja la lógica: si hay vehículo, toma su tipo; si no, usa el tipo especificado
        EntradaSalida entradaSalida = EntradaSalidaMapper.toEntityFromVisitante(dto);

        // 2. Generar folio automático único
        entradaSalida.setFolioTicket(generarFolioUnico());

        // 3. Los demás atributos quedan nulos o se ponen por defecto automáticamente
        // (fecha y horaEntrada se ponen automáticamente por @PrePersist en la entidad)

        // Guardar la entidad
        EntradaSalida savedEntradaSalida = entradaSalidaRepository.save(entradaSalida);

        // Convertir a DTO de respuesta usando el mapper
        return EntradaSalidaMapper.toResponseDto(savedEntradaSalida);
    }

    @Override
    @Transactional(readOnly = true)
    public EntradaSalidaResponseDto solicitarDatosSalidaVisitante(Integer folioTicket) {
        return salidaVisitante(folioTicket, false);
    }

    @Override
    @Transactional(readOnly = true)
    public EntradaSalidaResponseDto marcarSalidaVisitante(Integer folioTicket) {
        return salidaVisitante(folioTicket, true);
    }

    /**
     * Lógica compartida para obtener los datos de salida de un visitante.
     * Si guardarDatosBD es true, también guarda la hora de salida y el monto a pagar en la base de datos.
     */

    private EntradaSalidaResponseDto salidaVisitante(Integer folioTicket, boolean guardarDatosBD){
        // 1. Buscar el registro por folio
        EntradaSalida entradaSalida = entradaSalidaRepository.findByFolioTicket(folioTicket)
                .orElseThrow(() -> new ResourceNotFoundException(EntradaSalidaMessages.ERROR_ENTRADA_SALIDA_NOT_FOUND));

        // 2. Validar que sea un visitante (no tiene usuario asociado)
        if (entradaSalida.getUsuario() != null) {
            throw new BadRequestException(EntradaSalidaMessages.ERROR_FOLIO_ES_PENSIONADO);
        }

        // 3. Validar que no tenga ya una salida registrada
        if (entradaSalida.getHoraSalida() != null) {
            throw new BadRequestException(EntradaSalidaMessages.ERROR_SALIDA_YA_REGISTRADA);
        }

        // 4. Establecer hora de salida actual
        LocalTime horaSalida = LocalTime.now();

        // 5. Calcular tiempo transcurrido en minutos
        long minutosTranscurridos = Duration.between(entradaSalida.getHoraEntrada(), horaSalida).toMinutes();

        // 6. Obtener tarifas activas para el tipo de vehículo, ordenadas por tiempo ascendente
        List<Tarifa> tarifas = tarifaRepository.findByTipoVehiculoAndEstatusOrderByTiempoAsc(
                entradaSalida.getTipoVehiculo(), true);

        if (tarifas.isEmpty()) {
            throw new ResourceNotFoundException(TarifaMessages.ERROR_TARIFA_NOT_FOUND +
                    ": " + entradaSalida.getTipoVehiculo().getNombre());
        }

        // 7. Calcular el monto a pagar según las tarifas
        double montoPagar = calcularMontoPago(minutosTranscurridos, tarifas);

        // 8. Actualizar la entidad con hora de salida y monto a pagar
        entradaSalida.setHoraSalida(horaSalida);
        entradaSalida.setCantidadPago(montoPagar);

        // 9. Si es marcado, se guardan los datos en la base de datos
        if(guardarDatosBD){
            entradaSalidaRepository.save(entradaSalida); // Guardar el registro con hora de salida y monto a pagar
        }

        // 10. Crear el DTO de respuesta con los datos calculados
        EntradaSalidaResponseDto responseDto = EntradaSalidaMapper.toResponseDto(entradaSalida);
        responseDto.setHoraSalida(horaSalida);
        responseDto.setCantidadPago(montoPagar);

        return responseDto;
    }

    /**
     * Calcula el monto a pagar basado en el tiempo transcurrido y las tarifas disponibles.
     * Se cobra por cada fracción de tiempo definida en las tarifas.
     */
    private double calcularMontoPago(long minutosTranscurridos, List<Tarifa> tarifas) {
        double montoTotal = 0.0;
        long minutosRestantes = minutosTranscurridos;

        // Si no hay minutos transcurridos, no se cobra
        if (minutosTranscurridos <= 0) {
            return 0.0;
        }

        // Iterar sobre las tarifas de menor a mayor tiempo
        for (Tarifa tarifa : tarifas) {
            if (minutosRestantes <= 0) {
                break;
            }

            // Calcular cuántas fracciones de tiempo se consumen
            long fracciones = (long) Math.ceil((double) minutosRestantes / tarifa.getTiempo());

            // Si hay más de una tarifa, solo se cobra una fracción de la tarifa actual
            // y se pasa a la siguiente tarifa para el tiempo restante
            if (tarifas.size() > 1 && minutosRestantes > tarifa.getTiempo()) {
                fracciones = 1;
            }

            montoTotal += fracciones * tarifa.getCosto();
            minutosRestantes -= fracciones * tarifa.getTiempo();
        }

        return montoTotal;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EntradaSalidaResponseDto> searchAndSortPaginated(String search, String sortBy, String sortOrder, int page, int size) {
        /*
        // 1. Crear el objeto Sort según los parámetros
        Sort sort;

        if (sortBy == null || sortBy.isEmpty() || sortBy.equalsIgnoreCase("fecha")) {
            // Por defecto: ordenar por fecha y hora de entrada descendente
            Sort.Direction direction = "asc".equalsIgnoreCase(sortOrder) ? Sort.Direction.ASC : Sort.Direction.DESC;
            sort = Sort.by(direction, "fecha").and(Sort.by(direction, "horaEntrada"));
        } else if (sortBy.equalsIgnoreCase("tipovehiculo")) {
            // Ordenar por tipo de vehículo
            Sort.Direction direction = "desc".equalsIgnoreCase(sortOrder) ? Sort.Direction.DESC : Sort.Direction.ASC;
            sort = Sort.by(direction, "tipoVehiculo.nombre");
        } else {
            // Por defecto si el sortBy no es reconocido
            sort = Sort.by(Sort.Direction.DESC, "fecha").and(Sort.by(Sort.Direction.DESC, "horaEntrada"));
        }

        // 2. Crear el objeto Pageable con paginación y ordenamiento
        Pageable pageable = PageRequest.of(page, size, sort);

        // 3. Obtener resultados paginados directamente de la base de datos
        Page<EntradaSalida> entradasSalidasPage = entradaSalidaRepository.findByFolioOrUsuarioNombre(search, pageable);

        // 4. Convertir a DTOs usando map
        return entradasSalidasPage.map(EntradaSalidaMapper::toResponseDto); */
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReporteGananciasResponseDto> generarReporteGananciasPorHora(LocalDate fechaInicial, LocalDate fechaFinal, String sortOrder, int page, int size) {
        // 1. Determinar el rango de fechas
        LocalDate fechaInicialFinal = fechaInicial;
        LocalDate fechaFinalFinal = fechaFinal;

        // Si no se especifican fechas, obtener todas las fechas disponibles en la BD
        if (fechaInicialFinal == null && fechaFinalFinal == null) {
            fechaInicialFinal = entradaSalidaRepository.findMinFecha();
            fechaFinalFinal = entradaSalidaRepository.findMaxFecha();

            // Si no hay registros en la BD, retornar página vacía
            if (fechaInicialFinal == null || fechaFinalFinal == null) {
                Pageable pageable = PageRequest.of(page, size);
                return new PageImpl<>(new ArrayList<>(), pageable, 0);
            }
        } else if (fechaInicialFinal == null) {
            fechaInicialFinal = fechaFinalFinal;
        } else if (fechaFinalFinal == null) {
            fechaFinalFinal = fechaInicialFinal;
        }

        // 2. Crear el objeto Pageable para la paginación en BD
        Pageable pageable = PageRequest.of(page, size);

        // 3. Obtener resultados paginados directamente de la base de datos según el orden
        Page<Object[]> resultados;
        if ("asc".equalsIgnoreCase(sortOrder)) {
            resultados = entradaSalidaRepository.findReporteGananciasPorHoraAsc(
                fechaInicialFinal, fechaFinalFinal, pageable
            );
        } else {
            resultados = entradaSalidaRepository.findReporteGananciasPorHoraDesc(
                fechaInicialFinal, fechaFinalFinal, pageable
            );
        }

        // Capturar el rango de fechas para usar en todos los DTOs
        final LocalDate rangoInicial = fechaInicialFinal;
        final LocalDate rangoFinal = fechaFinalFinal;

        // 4. Convertir los resultados a DTOs
        List<ReporteGananciasResponseDto> reporteDtos = resultados.getContent().stream()
            .map(row -> {
                // Ahora obtenemos fecha y hora individual de cada registro
                LocalDate fechaRegistro = ((java.sql.Date) row[0]).toLocalDate();
                Integer hora = ((Number) row[1]).intValue();
                Double gananciasVisitantes = ((Number) row[2]).doubleValue();
                Double gananciasPensionados = ((Number) row[3]).doubleValue();

                ReporteGananciasResponseDto dto = new ReporteGananciasResponseDto();
                // El rango completo solicitado
                dto.setFechaInicial(rangoInicial);
                dto.setFechaFinal(rangoFinal);
                // La hora de esta fecha específica (si hay 3 fechas, habrá 3 registros para cada hora)
                dto.setHora(LocalTime.of(hora, 0));
                dto.setGananciasVisitantes(gananciasVisitantes);
                dto.setGananciasPensionados(gananciasPensionados);
                dto.setGananciasTotales(gananciasVisitantes + gananciasPensionados);

                return dto;
            })
            .collect(Collectors.toList());

        // 5. Retornar el Page con los DTOs
        return new PageImpl<>(reporteDtos, pageable, resultados.getTotalElements());
    }


    // Método privado para generar folio único
    private Integer generarFolioUnico() {
        Random random = new Random();
        Integer folio;
        do {
            folio = 100000 + random.nextInt(900000); // Genera número de 6 dígitos
        } while (entradaSalidaRepository.existsByFolioTicket(folio));
        return folio;
    }
    /*
    // Método privado para verificar si la pensión vence hoy
    private boolean verificarVencimientoPension(Usuario usuario) {
        // Asumiendo que existe un método en el usuario para obtener la fecha de vencimiento
        if (usuario.getFechaVencimientoPension() != null) {
            LocalDate hoy = LocalDate.now();
            return usuario.getFechaVencimientoPension().equals(hoy);
        }
        return false;
    }
    */

}
