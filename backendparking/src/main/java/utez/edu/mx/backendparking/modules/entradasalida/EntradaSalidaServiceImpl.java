package utez.edu.mx.backendparking.modules.entradasalida;

import jakarta.validation.ConstraintViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaCreatePensionadoRequestDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaCreateVisitanteRequestDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaResponseDto;
import utez.edu.mx.backendparking.modules.tarifa.Tarifa;
import utez.edu.mx.backendparking.modules.tarifa.TarifaMessages;
import utez.edu.mx.backendparking.modules.tarifa.TarifaRepository;
import utez.edu.mx.backendparking.shared.exception.BadRequestException;
import utez.edu.mx.backendparking.shared.exception.ResourceNotFoundException;

import java.sql.SQLException;
import java.time.Duration;
import java.time.LocalTime;
import java.util.List;
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
        /*
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
        */
        return null;
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

    /*
    // Método privado para generar folio único
    private Integer generarFolioUnico() {
        Random random = new Random();
        Integer folio;
        do {
            folio = 100000 + random.nextInt(900000); // Genera número de 6 dígitos
        } while (entradaSalidaRepository.existsByFolioTicket(folio));
        return folio;
    }

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
