package utez.edu.mx.backendparking.modules.usuariopension;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.backendparking.modules.historialpagos.Pago;
import utez.edu.mx.backendparking.modules.historialpagos.PagoRepository;
import utez.edu.mx.backendparking.modules.historialpagos.dto.PagoResponseDto;
import utez.edu.mx.backendparking.modules.pension.Pension;
import utez.edu.mx.backendparking.modules.pension.PensionRepository;
import utez.edu.mx.backendparking.modules.roles.ERole;
import utez.edu.mx.backendparking.modules.roles.Repository.RolesRepository;
import utez.edu.mx.backendparking.modules.roles.Roles;
import utez.edu.mx.backendparking.modules.tipovehiculo.model.TipoVehiculo;
import utez.edu.mx.backendparking.modules.tipovehiculo.repository.TipoVehiculoRepository;
import utez.edu.mx.backendparking.modules.usuario.Usuario;
import utez.edu.mx.backendparking.modules.usuario.UsuarioRepository;
import utez.edu.mx.backendparking.modules.usuariopension.dto.*;
import utez.edu.mx.backendparking.modules.vehiculo.model.Vehiculo;
import utez.edu.mx.backendparking.modules.vehiculo.repository.VehiculoRepository;
import utez.edu.mx.backendparking.shared.exception.ConflictException;
import utez.edu.mx.backendparking.shared.exception.ResourceNotFoundException;

import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PensionadoService {

    private final UsuarioRepository usuarioRepository;
    private final RolesRepository rolesRepository;
    private final PensionRepository pensionRepository;
    private final TipoVehiculoRepository tipoVehiculoRepository;
    private final VehiculoRepository vehiculoRepository;
    private final UsuarioPensionRepository usuarioPensionRepository;
    private final PagoRepository pagoRepository;
    private final PasswordEncoder passwordEncoder;

    public PensionadoService(UsuarioRepository usuarioRepository, RolesRepository rolesRepository, PensionRepository pensionRepository, TipoVehiculoRepository tipoVehiculoRepository, VehiculoRepository vehiculoRepository, UsuarioPensionRepository usuarioPensionRepository, PagoRepository pagoRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.rolesRepository = rolesRepository;
        this.pensionRepository = pensionRepository;
        this.tipoVehiculoRepository = tipoVehiculoRepository;
        this.vehiculoRepository = vehiculoRepository;
        this.usuarioPensionRepository = usuarioPensionRepository;
        this.pagoRepository = pagoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public PensionadoResponseDto registrarseComoPensionado(PensionadoRegistrationDto dto) {

        // Validar que el correo no exista
        if (usuarioRepository.existsByCorreo(dto.getCorreo())) {
            throw new ConflictException("Ya existe un usuario con el correo: " + dto.getCorreo());
        }

        // Validar que las placas no estén duplicadas, NOTA, SE PENSARA que se haga validacion que se pueda repetir en general, pero para pensionados, placas de vehiculos que no esten asignados a un usuario.
        //validarPlacasUnicas(dto.getVehiculos());

        // Obtener y validar la pensión
        Pension pension = pensionRepository.findById(dto.getPensionId())
                .orElseThrow(() -> new ResourceNotFoundException("Pensión no encontrada con ID: " + dto.getPensionId()));

        if (!pension.isStatus()) {
            throw new ConflictException("La pensión seleccionada no está disponible");
        }

        // Obtener el rol CLIENTE_PENSIONADO
        Roles rolPensionado = rolesRepository.findByName(ERole.CLIENTE_PENSIONADO)
                .orElseThrow(() -> new ResourceNotFoundException("Rol CLIENTE_PENSIONADO no encontrado"));

        // Crear usuario
        Usuario usuario = PensionadoMapper.toUsuarioEntity(dto);
        usuario.setContra(passwordEncoder.encode(dto.getContra()));
        usuario.setRol(rolPensionado);
        usuario = usuarioRepository.save(usuario);

        // Crear vehículos
        List<Vehiculo> vehiculos = new ArrayList<>();
        for (VehiculoDto vehiculoDto : dto.getVehiculos()) {
            TipoVehiculo tipoVehiculo = tipoVehiculoRepository.findById(vehiculoDto.getTipoVehiculoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Tipo de vehículo no encontrado con ID: " + vehiculoDto.getTipoVehiculoId()));

            Vehiculo vehiculo = PensionadoMapper.toVehiculoEntity(vehiculoDto, tipoVehiculo, usuario);
            vehiculos.add(vehiculoRepository.save(vehiculo));
        }

        // Calcular fechas
        LocalDate fechaInicio = LocalDate.now();
        LocalDate fechaFinalizacion = fechaInicio.plusDays(pension.getDuracionDias());

        // Generar UUID único para QR
        String uuidCodigoQR = generarUuidUnico();

        // Crear UsuarioPension
        UsuarioPension usuarioPension = PensionadoMapper.toUsuarioPensionEntity(usuario, pension, uuidCodigoQR, fechaFinalizacion);
        usuarioPension = usuarioPensionRepository.save(usuarioPension);

        // Crear Pago
        Pago pago = PensionadoMapper.toPagoEntity(usuarioPension, pension.getCosto(), fechaInicio, fechaFinalizacion,pension);
        pago = pagoRepository.save(pago);

        return PensionadoMapper.toResponseDto(usuario, usuarioPension, pago, vehiculos);
    }

    private void validarPlacasUnicas(List<VehiculoDto> vehiculos) {
        for (VehiculoDto vehiculoDto : vehiculos) {
            if (vehiculoRepository.existsByPlaca(vehiculoDto.getPlaca())) {
                throw new ConflictException("Ya existe un vehículo con la placa: " + vehiculoDto.getPlaca());
            }
        }
    }

    private String generarUuidUnico() {
        String uuid;
        do {
            uuid = UUID.randomUUID().toString();
        } while (usuarioPensionRepository.existsByUuidCodigoQR(uuid));
        return uuid;
    }


    @Transactional(readOnly = true)
    public Page<UsuarioPensionResponseDto> findAllUsuariosPensionados(Pageable pageable, String search) {
        Page<UsuarioPension> usuariosPension = usuarioPensionRepository.findAllWithUsuarioAndPension(pageable, search);

        return usuariosPension.map(up -> {
            // Buscar el costo del último pago según la fecha de finalización
            Optional<Pago> ultimoPago = pagoRepository.findUltimoPagoPorFechaFinalizacion(up.getId(), up.getFechaFinalizacion());
            Double costoUltimoPago = ultimoPago.map(Pago::getCantidadPago).orElse(up.getPension().getCosto());

            return new UsuarioPensionResponseDto(up.getId(), up.getUsuario().getCorreo(), up.getPension().getNombre(), up.getFechaFinalizacion(), costoUltimoPago, up.isEstatus(), up.getUuidCodigoQR());
        });
    }

    @Transactional(readOnly = true)
    public Page<PagoResponseDto> findHistorialPagosByUsuarioPension(Long usuarioPensionId, Pageable pageable) {
        Page<Pago> pagos = pagoRepository.findByUsuarioPensionId(usuarioPensionId, pageable);

        return pagos.map(pago -> new PagoResponseDto(pago.getId(), pago.getCantidadPago(), pago.getFechaPago(), pago.getFechaInicio(), pago.getFechaFin()));
    }

    @Transactional
    public void renovarPension(Long usuarioPensionId, RenovarPensionRequestDto dto) {
        UsuarioPension usuarioPension = usuarioPensionRepository.findById(usuarioPensionId)
                .orElseThrow(() -> new RuntimeException("Usuario pensión no encontrado"));

        Pension nuevaPension = pensionRepository.findById(dto.getIdPension())
                .orElseThrow(() -> new RuntimeException("Tipo de pensión no encontrado"));

        LocalDate fechaActual = LocalDate.now();

        // ESCENARIO 3: Si la pensión está desactivada, activar inmediatamente
        if (!usuarioPension.isEstatus()) {
            LocalDate fechaInicio = fechaActual;
            LocalDate fechaFin = fechaInicio.plusDays(nuevaPension.getDuracionDias());

            // Crear pago
            Pago nuevoPago = new Pago();
            nuevoPago.setCantidadPago(nuevaPension.getCosto());
            nuevoPago.setFechaPago(fechaActual);
            nuevoPago.setFechaInicio(fechaInicio);
            nuevoPago.setFechaFin(fechaFin);
            nuevoPago.setUsuarioPension(usuarioPension);
            nuevoPago.setPension(nuevaPension); // Asociar la pensión al pago
            pagoRepository.save(nuevoPago);

            // Actualizar usuario pension inmediatamente
            usuarioPension.setFechaFinalizacion(fechaFin);
            usuarioPension.setPension(nuevaPension);
            usuarioPension.setEstatus(true);
            usuarioPensionRepository.save(usuarioPension);

        } else {
            // ESCENARIO 2: Pensión activa - pago para futuro (lo manejará el scheduler)
            LocalDate fechaInicio = usuarioPension.getFechaFinalizacion().plusDays(1);
            LocalDate fechaFin = fechaInicio.plusDays(nuevaPension.getDuracionDias() - 1);

            Pago nuevoPago = new Pago();
            nuevoPago.setCantidadPago(nuevaPension.getCosto());
            nuevoPago.setFechaPago(fechaActual);
            nuevoPago.setFechaInicio(fechaInicio);
            nuevoPago.setFechaFin(fechaFin);
            nuevoPago.setUsuarioPension(usuarioPension);
            nuevoPago.setPension(nuevaPension); // Asociar la pensión al pago
            pagoRepository.save(nuevoPago);

            // NO actualizar usuarioPension aquí - lo hará el scheduler cuando llegue la fecha
        }
    }

    @Transactional
    public void actualizarPensionesVencidas() {
        LocalDate fechaActual = LocalDate.now();
        System.out.println("INICIANDO SCHEDULER - Fecha actual: " + fechaActual);

        List<UsuarioPension> pensionesVencidas = usuarioPensionRepository.findPensionesVencidas(fechaActual);
        System.out.println("Pensiones vencidas encontradas: " + pensionesVencidas.size());

        for (UsuarioPension usuarioPension : pensionesVencidas) {
            System.out.println("Procesando UsuarioPension ID: " + usuarioPension.getId() +
                    " - Fecha fin: " + usuarioPension.getFechaFinalizacion());

            // VERIFICAR PAGOS
            List<Pago> todosPagos = pagoRepository.findAllByUsuarioPensionId(usuarioPension.getId());
            System.out.println("Total pagos para esta pension: " + todosPagos.size());
            for (Pago pago : todosPagos) {
                System.out.println("Pago ID: " + pago.getId() +
                        " - Fecha inicio: " + pago.getFechaInicio() +
                        " - Fecha fin: " + pago.getFechaFin());
            }

            // BUSCAR PAGO FUTURO VÁLIDO (con ambas condiciones)
            Optional<Pago> pagoFuturo = pagoRepository.findPagoFuturoValido(
                    usuarioPension.getId(),
                    usuarioPension.getFechaFinalizacion(),
                    fechaActual);  //  Pasar fecha actual

            System.out.println("Pago futuro válido encontrado: " + pagoFuturo.isPresent());

            if (pagoFuturo.isPresent()) {
                Pago pago = pagoFuturo.get();
                System.out.println("Aplicando pago futuro - Fecha inicio: " + pago.getFechaInicio());

                usuarioPension.setFechaFinalizacion(pago.getFechaFin());
                usuarioPension.setPension(pago.getPension());
                usuarioPension.setEstatus(true);
                usuarioPensionRepository.save(usuarioPension);
                System.out.println("Pension ACTUALIZADA");
            } else {
                usuarioPension.setEstatus(false);
                usuarioPensionRepository.save(usuarioPension);
                System.out.println("Pension DESACTIVADA");
            }
        }
        System.out.println("SCHEDULER COMPLETADO");
    }
}
