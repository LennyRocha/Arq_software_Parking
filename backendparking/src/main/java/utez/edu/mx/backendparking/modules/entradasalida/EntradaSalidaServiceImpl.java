package utez.edu.mx.backendparking.modules.entradasalida;

import jakarta.validation.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.backendparking.modules.cajon.model.Cajon;
import utez.edu.mx.backendparking.modules.cajon.repository.CajonRepository;
import utez.edu.mx.backendparking.modules.cajon.service.CajonService;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaCreatePensionadoRequestDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaCreateVisitanteRequestDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaResponseDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.ReporteGananciasResponseDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.ReporteGananciasTotalesResponseDto;
import utez.edu.mx.backendparking.modules.historialpagos.PagoRepository;
import utez.edu.mx.backendparking.modules.roles.ERole;
import utez.edu.mx.backendparking.modules.tarifa.Tarifa;
import utez.edu.mx.backendparking.modules.tarifa.TarifaMessages;
import utez.edu.mx.backendparking.modules.tarifa.TarifaRepository;
import utez.edu.mx.backendparking.modules.tipovehiculo.model.TipoVehiculo;
import utez.edu.mx.backendparking.modules.tipovehiculo.repository.TipoVehiculoRepository;
import utez.edu.mx.backendparking.modules.usuario.Usuario;
import utez.edu.mx.backendparking.modules.usuario.UsuarioRepository;
import utez.edu.mx.backendparking.modules.usuariopension.UsuarioPension;
import utez.edu.mx.backendparking.modules.usuariopension.UsuarioPensionMessages;
import utez.edu.mx.backendparking.modules.usuariopension.UsuarioPensionRepository;
import utez.edu.mx.backendparking.modules.vehiculo.model.Vehiculo;
import utez.edu.mx.backendparking.modules.vehiculo.model.VehiculoEstacionadoResponseDto;
import utez.edu.mx.backendparking.modules.vehiculo.repository.VehiculoRepository;
import utez.edu.mx.backendparking.security.SecurityUtils;
import utez.edu.mx.backendparking.shared.api.ApiResponse;
import utez.edu.mx.backendparking.shared.exception.BadRequestException;
import utez.edu.mx.backendparking.shared.exception.ResourceNotFoundException;
import utez.edu.mx.backendparking.shared.webClient.WebClientConfig;

import java.sql.SQLException;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EntradaSalidaServiceImpl implements EntradaSalidaService {

    private final EntradaSalidaRepository entradaSalidaRepository;
    private final TarifaRepository tarifaRepository;
    private final UsuarioPensionRepository usuarioPensionRepository;
    private final VehiculoRepository vehiculoRepository;
    private final TipoVehiculoRepository tipoVehiculoRepository;
    private final PagoRepository pagoRepository;
    private final UsuarioRepository usuarioRepository;
    private final CajonService cajonService;

    public EntradaSalidaServiceImpl(EntradaSalidaRepository entradaSalidaRepository, TarifaRepository tarifaRepository, UsuarioPensionRepository usuarioPensionRepository, VehiculoRepository vehiculoRepository, TipoVehiculoRepository tipoVehiculoRepository, PagoRepository pagoRepository, UsuarioRepository usuarioRepository, CajonService cajonService) {
        this.entradaSalidaRepository = entradaSalidaRepository;
        this.tarifaRepository = tarifaRepository;
        this.usuarioPensionRepository = usuarioPensionRepository;
        this.vehiculoRepository = vehiculoRepository;
        this.tipoVehiculoRepository = tipoVehiculoRepository;
        this.pagoRepository = pagoRepository;
        this.usuarioRepository = usuarioRepository;
        this.cajonService = cajonService;
    }

    @Value("${websocket.server.url}")
    private String websocketServerUrl;

    @Autowired
    private WebClientConfig webClientConfig;

    private void updateNodeServer(String accion, Long userId) {
        EntradaSalidaSocket socket = new EntradaSalidaSocket(userId, accion);

        webClientConfig.createClient(websocketServerUrl).post()
                .uri("/marcarje")
                .bodyValue(socket)
                .retrieve()
                .bodyToMono(String.class)
                .doOnError(error -> System.err.println("Error: " + error.getMessage()))
                .subscribe();
    }

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

        // Obtener el usuario autenticado actual
        Usuario usuarioActual = SecurityUtils.getCurrentUser();

        // Validar que si es usuario pensionado, tengan su pension activa
        if(usuarioActual.getRol().getName() == ERole.CLIENTE_PENSIONADO){
            // Buscar si el usuario tiene una pensión activa
            Optional<UsuarioPension> usuarioPensionOpt = usuarioPensionRepository.findByUsuarioIdAndEstatusTrue(usuarioActual.getId());

            if (usuarioPensionOpt.isEmpty()) {
                throw new BadRequestException(UsuarioPensionMessages.ERROR_USUARIO_PENSION_NOT_FOUND);
            }
        }

        EntradaSalida entradaSalida = entradaSalidaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(EntradaSalidaMessages.ERROR_ENTRADA_SALIDA_NOT_FOUND));

        // Validar que si es usuario pensionado, la entrada buscada corresponda a una de sus entradas
        if(usuarioActual.getRol().getName() == ERole.CLIENTE_PENSIONADO){
            if(entradaSalida.getUsuario() == null || !entradaSalida.getUsuario().getId().equals(usuarioActual.getId())){
                throw new BadRequestException(EntradaSalidaMessages.ERROR_VEHICULO_NO_ENCONTRADO);
            }
        }

        return EntradaSalidaMapper.toResponseDto(entradaSalida);
    }

    @Override
    @Transactional(rollbackFor = {SQLException.class, ConstraintViolationException.class})
    public EntradaSalidaResponseDto createPensionado(EntradaSalidaCreatePensionadoRequestDto dto) {

        // 1. Validar que el usuario tenga una pensión activa buscando por su codigo QR
        UsuarioPension usuarioPension = usuarioPensionRepository.findByUuidCodigoQRAndEstatusTrue(dto.getUuidCodigoQR())
                .orElseThrow(() -> new ResourceNotFoundException(UsuarioPensionMessages.ERROR_USUARIO_PENSION_NOT_FOUND));

        // 2. Buscar el vehículo por ID en la base de datos
        Vehiculo vehiculo = vehiculoRepository.findById(dto.getVehiculo().getId())
                .orElseThrow(() -> new ResourceNotFoundException(EntradaSalidaMessages.ERROR_VEHICULO_NO_ENCONTRADO));

        // 3. Validar que el vehículo le pertenezca al usuario
        if (!vehiculo.getUsuario().getId().equals(usuarioPension.getUsuario().getId())) {
            throw new BadRequestException(EntradaSalidaMessages.ERROR_VEHICULO_NO_PERTENECE_USUARIO);
        }

        // 4. Convertir DTO a entidad usando el mapper
        EntradaSalida entradaSalida = EntradaSalidaMapper.toEntityFromPensionado(dto, usuarioPension.getUsuario());

        // 5. Generar folio automático único
        entradaSalida.setFolioTicket(generarFolioUnico());

        // 6. Verificar si la pensión va a caducar en el día en curso
        boolean vencimientoHoy = verificarVencimientoPension(usuarioPension);
        entradaSalida.setVencimientoPension(vencimientoHoy);

        // Guardar la entidad
        entradaSalida.setVehiculo(vehiculo);
        entradaSalida.setTipoVehiculo(vehiculo.getTipoVehiculo());
        EntradaSalida savedEntradaSalida = entradaSalidaRepository.save(entradaSalida);

        // Cambiar ultima entrada del usuario y guardar
        usuarioPension.setUltimaEntradaSalida(savedEntradaSalida);

        // Generar UUID único
        usuarioPension.setUuidCodigoQR(generarUuidUnico());

        usuarioPensionRepository.save(usuarioPension);

        //Ocupar un cajón
        int tipo = entradaSalida.getVehiculo().getTipoVehiculo().getId();
        cajonService.cambiarDisponibilidadForPensionados(true,tipo);

        updateNodeServer("entrada",usuarioPension.getUsuario().getId());

        // Convertir a DTO de respuesta usando el mapper
        return EntradaSalidaMapper.toResponseDto(savedEntradaSalida);
    }

    @Override
    @Transactional(rollbackFor = {SQLException.class, ConstraintViolationException.class})
    public EntradaSalidaResponseDto createVisitante(EntradaSalidaCreateVisitanteRequestDto dto) {

        EntradaSalida entradaSalida = new EntradaSalida();

        // Caso 1: Si viene un vehículo registrado
        if (dto.getVehiculo() != null) {
            Vehiculo vehiculo = new Vehiculo();
            vehiculo.setEstatus(true);
            vehiculo.setModelo(dto.getVehiculo().getModelo());
            vehiculo.setPlaca(dto.getVehiculo().getPlaca());
            vehiculo.setTipoVehiculo(dto.getVehiculo().getTipoVehiculo());
            vehiculo.setDescripcion(dto.getVehiculo().getDescripcion());

            // Se hace el guardado del nuevo vehiculo y se asigna a la entrada
            entradaSalida.setVehiculo(vehiculoRepository.save(vehiculo));
            entradaSalida.setTipoVehiculo(vehiculo.getTipoVehiculo());
        }

        // Caso 2: Si solo viene el tipo de vehículo (visitante sin vehículo registrado)
        else if (dto.getTipoVehiculo() != null) {
            TipoVehiculo tipoVehiculo = tipoVehiculoRepository.findById(dto.getTipoVehiculo().getId())
                    .orElseThrow(() -> new RuntimeException(EntradaSalidaMessages.ERROR_TIPO_VEHICULO_OBLIGATORIO));

            entradaSalida.setTipoVehiculo(tipoVehiculo);
            // vehiculo queda null (es un visitante sin vehículo registrado)
        }

        // Generar folio único
        entradaSalida.setFolioTicket(generarFolioUnico());

        // Guardar
        EntradaSalida savedEntradaSalida = entradaSalidaRepository.save(entradaSalida);

        //Ocupar un cajón
        cajonService.cambiarDisponibilidad(true, dto.getTipoVehiculo().getId());

        return EntradaSalidaMapper.toResponseDto(savedEntradaSalida);
    }


    @Override
    @Transactional(rollbackFor = {SQLException.class, ConstraintViolationException.class})
    public EntradaSalidaResponseDto actualizarEntrada(Long idEntradaSalida, EntradaSalidaCreateVisitanteRequestDto dto) {

        // 1. Buscar la entrada/salida existente
        EntradaSalida entradaSalidaExistente = entradaSalidaRepository.findById(idEntradaSalida)
                .orElseThrow(() -> new ResourceNotFoundException(EntradaSalidaMessages.ERROR_ENTRADA_SALIDA_NOT_FOUND));

        // 2. Verificar que sea de visitante
        if(entradaSalidaExistente.getUsuario() != null) {
            throw new BadRequestException(EntradaSalidaMessages.ERROR_SOLO_ACTUALIZAR_VISITANTES);
        }

        // 3. Actualizar vehículo si viene en el DTO
        if (dto.getVehiculo() != null) {
            Vehiculo vehiculo;

            // Verificar si tiene ID (actualizar) o no (crear nuevo)
            if (dto.getVehiculo().getId() != null) {
                // Actualizar vehículo existente
                vehiculo = vehiculoRepository.findById(dto.getVehiculo().getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Vehículo no encontrado"));
            } else {
                // Crear nuevo vehículo
                vehiculo = new Vehiculo();
                vehiculo.setUsuario(null); // ✅ Explícitamente null para visitantes
            }

            // Actualizar campos del vehículo
            if (dto.getVehiculo().getModelo() != null) {
                vehiculo.setModelo(dto.getVehiculo().getModelo());
            }
            if (dto.getVehiculo().getPlaca() != null) {
                vehiculo.setPlaca(dto.getVehiculo().getPlaca());
            }
            if (dto.getVehiculo().getDescripcion() != null) {
                vehiculo.setDescripcion(dto.getVehiculo().getDescripcion());
            }

            // ✅ Validar que tipoVehiculo no sea null antes de acceder a getId()
            if (dto.getVehiculo().getTipoVehiculo() != null && dto.getVehiculo().getTipoVehiculo().getId() != null) {
                TipoVehiculo tipoVehiculo = tipoVehiculoRepository.findById(dto.getVehiculo().getTipoVehiculo().getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Tipo de vehículo no encontrado"));
                vehiculo.setTipoVehiculo(tipoVehiculo);
            } else if (vehiculo.getId() == null) {
                // Si es un vehículo nuevo, el tipo es obligatorio
                throw new BadRequestException("El tipo de vehículo es obligatorio");
            }

            vehiculo.setEstatus(true);
            vehiculo = vehiculoRepository.save(vehiculo);

            entradaSalidaExistente.setVehiculo(vehiculo);
            entradaSalidaExistente.setTipoVehiculo(vehiculo.getTipoVehiculo());
        }
        // 4. Si solo viene tipo de vehículo
        else if (dto.getTipoVehiculo() != null && dto.getTipoVehiculo().getId() != null) {
            // Si antes habia una entrada ocupando ese vehiculo
            if(entradaSalidaExistente.getVehiculo() != null && entradaSalidaExistente.getVehiculo().getUsuario() == null){
                vehiculoRepository.deleteById(entradaSalidaExistente.getVehiculo().getId());
            }

            TipoVehiculo tipoVehiculo = tipoVehiculoRepository.findById(dto.getTipoVehiculo().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Tipo de vehículo no encontrado"));

            entradaSalidaExistente.setTipoVehiculo(tipoVehiculo);
            entradaSalidaExistente.setVehiculo(null);
        }

        // 5. Guardar
        EntradaSalida savedEntradaSalida = entradaSalidaRepository.save(entradaSalidaExistente);

        // 6. Convertir a DTO de respuesta
        return EntradaSalidaMapper.toResponseDto(savedEntradaSalida);
    }


    @Override
    @Transactional(readOnly = true)
    public EntradaSalidaResponseDto solicitarDatosSalidaVisitante(Integer folioTicket) {
        return salidaVisitante(folioTicket, false);
    }

    @Override
    @Transactional(rollbackFor = {SQLException.class, ConstraintViolationException.class})
    public EntradaSalidaResponseDto marcarSalidaVisitante(Integer folioTicket) {
        return salidaVisitante(folioTicket, true);
    }

    @Override
    @Transactional(readOnly = true)
    public EntradaSalidaResponseDto solicitarDatosSalidaPensionado(String uuidCodigoQR) {
        return salidaPensionado(uuidCodigoQR, false);
    }

    @Override
    @Transactional(rollbackFor = {SQLException.class, ConstraintViolationException.class})
    public EntradaSalidaResponseDto marcarSalidaPensionado(String uuidCodigoQR) {
        return salidaPensionado(uuidCodigoQR, true);
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

        //Desocupar un cajón
        int tipo = entradaSalida.getTipoVehiculo().getId();
        cajonService.cambiarDisponibilidad(false, tipo);

        return responseDto;
    }

    private EntradaSalidaResponseDto salidaPensionado(String uuidCodigoQR, boolean guardarDatosBD){
        // 1. Buscar el registro por codigo QR
        UsuarioPension usuarioPension = usuarioPensionRepository.findByUuidCodigoQRAndEstatusTrue(uuidCodigoQR)
                .orElseThrow(() -> new ResourceNotFoundException(UsuarioPensionMessages.ERROR_USUARIO_PENSION_NOT_FOUND));

        // 2. Encontrar la última entradaSalida del usuario
        EntradaSalida entradaSalida = usuarioPension.getUltimaEntradaSalida();

        // 3. Validar que no tenga ya una salida registrada
        if (entradaSalida.getHoraSalida() != null) {
            throw new BadRequestException(EntradaSalidaMessages.ERROR_SALIDA_YA_REGISTRADA);
        }

        // 4. Establecer hora de salida actual
        LocalTime horaSalida = LocalTime.now();
        LocalDate fechaActual = LocalDate.now();

        // 5. Verificar si la pensión ya caducó
        boolean pensionCaducada = usuarioPension.getFechaFinalizacion() != null &&
                                   fechaActual.isAfter(usuarioPension.getFechaFinalizacion());

        double montoPagar = 0.0;

        // 6. Solo aplicar tarifa si la pensión ya caducó
        if (pensionCaducada) {
            // Calcular tiempo transcurrido en minutos
            long minutosTranscurridos = Duration.between(entradaSalida.getHoraEntrada(), horaSalida).toMinutes();

            // Obtener tarifas activas para el tipo de vehículo, ordenadas por tiempo ascendente
            List<Tarifa> tarifas = tarifaRepository.findByTipoVehiculoAndEstatusOrderByTiempoAsc(
                    entradaSalida.getTipoVehiculo(), true);

            if (tarifas.isEmpty()) {
                throw new ResourceNotFoundException(TarifaMessages.ERROR_TARIFA_NOT_FOUND +
                        ": " + entradaSalida.getTipoVehiculo().getNombre());
            }

            // Calcular el monto a pagar según las tarifas
            montoPagar = calcularMontoPago(minutosTranscurridos, tarifas);
        }

        // 7. Actualizar la entidad with hora de salida y monto a pagar
        entradaSalida.setHoraSalida(horaSalida);
        entradaSalida.setCantidadPago(montoPagar);

        // 8. Si es marcado, se guardan los datos en la base de datos
        if(guardarDatosBD){
            // Generar UUID único
            usuarioPension.setUuidCodigoQR(generarUuidUnico());
            usuarioPensionRepository.save(usuarioPension);

            entradaSalidaRepository.save(entradaSalida);
        }

        // 9. Crear el DTO de respuesta con los datos calculados
        EntradaSalidaResponseDto responseDto = EntradaSalidaMapper.toResponseDto(entradaSalida);
        responseDto.setHoraSalida(horaSalida);
        responseDto.setCantidadPago(montoPagar);

        //Desocupar un cajón
        int tipo = entradaSalida.getVehiculo().getTipoVehiculo().getId();
        cajonService.cambiarDisponibilidadForPensionados(false,tipo);

        updateNodeServer("salida",usuarioPension.getUsuario().getId());

        return responseDto;
    }

    /**
     * Calcula el monto a pagar basado en el tiempo transcurrido y las tarifas disponibles.
     * Se cobra por cada fracción de tiempo definida en las tarifas.
     */
    private double calcularMontoPago(long minutosTranscurridos, List<Tarifa> tarifas) {
        double montoTotal = 0.0;

        // Si hay 0 minutos transcurridos, se considera 1 minuto para cobrar la tarifa mínima
        // ya que se considera que el usuario ocupó el estacionamiento
        long minutosRestantes = minutosTranscurridos <= 0 ? 1 : minutosTranscurridos;

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
        return entradasSalidasPage.map(EntradaSalidaMapper::toResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EntradaSalidaResponseDto> searchAndSortPaginatedByPensionado(String search, String sortBy, String sortOrder, int page, int size) {

        // 1. Obtener el ID del usuario autenticado
        Long usuarioId = SecurityUtils.getCurrentUserId();

        // 2. Crear el objeto Sort según los parámetros
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

        // 3. Crear el objeto Pageable con paginación y ordenamiento
        Pageable pageable = PageRequest.of(page, size, sort);

        // 4. Obtener resultados paginados filtrados por usuario
        Page<EntradaSalida> entradasSalidasPage = entradaSalidaRepository.findByUsuarioIdAndFolioOrUsuarioNombre(search, usuarioId, pageable);

        // 5. Convertir a DTOs usando map
        return entradasSalidasPage.map(EntradaSalidaMapper::toResponseDto);
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

        // 3. Obtener resultados paginados combinados según el orden
        Page<Object[]> resultadosCombinados;

        if ("asc".equalsIgnoreCase(sortOrder)) {
            resultadosCombinados = entradaSalidaRepository.findReporteGananciasCombinadasPorHoraAsc(
                fechaInicialFinal, fechaFinalFinal, pageable
            );
        } else {
            resultadosCombinados = entradaSalidaRepository.findReporteGananciasCombinadasPorHoraDesc(
                fechaInicialFinal, fechaFinalFinal, pageable
            );
        }

        // Capturar el rango de fechas para usar en todos los DTOs
        final LocalDate rangoInicial = fechaInicialFinal;
        final LocalDate rangoFinal = fechaFinalFinal;

        // 4. Convertir los resultados a DTOs
        List<ReporteGananciasResponseDto> reporteDtos = new ArrayList<>();

        for (Object[] row : resultadosCombinados.getContent()) {
            int hora = ((Number) row[1]).intValue();
            Double gananciasVisitantes = ((Number) row[2]).doubleValue();
            Double gananciasPensionados = ((Number) row[3]).doubleValue();

            ReporteGananciasResponseDto dto = new ReporteGananciasResponseDto();
            dto.setFechaInicial(rangoInicial);
            dto.setFechaFinal(rangoFinal);
            dto.setHora(LocalTime.of(hora, 0));
            dto.setGananciasVisitantes(gananciasVisitantes);
            dto.setGananciasPensionados(gananciasPensionados);
            dto.setGananciasTotales(gananciasVisitantes + gananciasPensionados);

            reporteDtos.add(dto);
        }

        // 5. Retornar el Page con los DTOs
        return new PageImpl<>(reporteDtos, pageable, resultadosCombinados.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public String searchCodigoEntradaSalida(){
        // Obtener el usuario autenticado actual
        Usuario usuarioActual = SecurityUtils.getCurrentUser();

        // Buscar si el usuario tiene una pensión activa
        Optional<UsuarioPension> usuarioPensionOpt = usuarioPensionRepository.findByUsuarioIdAndEstatusTrue(usuarioActual.getId());

        if (usuarioPensionOpt.isEmpty()) {
            throw new BadRequestException(UsuarioPensionMessages.ERROR_USUARIO_PENSION_NOT_FOUND);
        }

        return usuarioPensionOpt.get().getUuidCodigoQR();
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

    // Método privado para verificar si la pensión vence hoy
    private boolean verificarVencimientoPension(UsuarioPension usuarioPension) {

        // Asumiendo que existe un método en el usuario para obtener la fecha de vencimiento
        if (usuarioPension.getFechaFinalizacion() != null) {
            LocalDate hoy = LocalDate.now();
            return usuarioPension.getFechaFinalizacion().equals(hoy);
        }
        return false;
    }

    // Método privado para generar UUID único para código QR
    private String generarUuidUnico() {
        String uuid;
        do {
            uuid = java.util.UUID.randomUUID().toString();
        } while (usuarioPensionRepository.existsByUuidCodigoQR(uuid));
        return uuid;
    }

    @Override
    @Transactional(readOnly = true)
    public ReporteGananciasTotalesResponseDto generarReporteGananciasTotales(LocalDate fechaInicial, LocalDate fechaFinal) {
        // 1. Determinar el rango de fechas
        LocalDate fechaInicialFinal = fechaInicial;
        LocalDate fechaFinalFinal = fechaFinal;

        // Si no se especifican fechas, obtener todas las fechas disponibles en la BD
        if (fechaInicialFinal == null && fechaFinalFinal == null) {
            fechaInicialFinal = entradaSalidaRepository.findMinFecha();
            fechaFinalFinal = entradaSalidaRepository.findMaxFecha();

            // Si no hay registros en la BD, retornar objeto con valores en 0
            if (fechaInicialFinal == null || fechaFinalFinal == null) {
                ReporteGananciasTotalesResponseDto dto = new ReporteGananciasTotalesResponseDto();
                dto.setFechaInicial(LocalDate.now());
                dto.setFechaFinal(LocalDate.now());
                dto.setGananciasVisitantes(0.0);
                dto.setGananciasPensionados(0.0);
                dto.setGananciasTotales(0.0);
                return dto;
            }
        } else if (fechaInicialFinal == null) {
            fechaInicialFinal = fechaFinalFinal;
        } else if (fechaFinalFinal == null) {
            fechaFinalFinal = fechaInicialFinal;
        }

        // 2. Obtener las ganancias totales de visitantes y pensionados
        Double gananciasVisitantes = entradaSalidaRepository.findReporteGananciasTotales(fechaInicialFinal, fechaFinalFinal);
        Double gananciasPensionados = pagoRepository.findGananciasPensionadosTotales(fechaInicialFinal, fechaFinalFinal);

        // 3. Asegurar que no sean null
        if (gananciasVisitantes == null) gananciasVisitantes = 0.0;
        if (gananciasPensionados == null) gananciasPensionados = 0.0;

        // 4. Crear y retornar el DTO
        ReporteGananciasTotalesResponseDto dto = new ReporteGananciasTotalesResponseDto();
        dto.setFechaInicial(fechaInicialFinal);
        dto.setFechaFinal(fechaFinalFinal);
        dto.setGananciasVisitantes(gananciasVisitantes);
        dto.setGananciasPensionados(gananciasPensionados);
        dto.setGananciasTotales(gananciasVisitantes + gananciasPensionados);

        return dto;
    }


}
