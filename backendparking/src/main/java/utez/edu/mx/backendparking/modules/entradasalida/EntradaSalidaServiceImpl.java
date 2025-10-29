package utez.edu.mx.backendparking.modules.entradasalida;

import jakarta.validation.ConstraintViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaCreatePensionadoRequestDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaCreateVisitanteRequestDto;
import utez.edu.mx.backendparking.modules.entradasalida.dto.EntradaSalidaResponseDto;

import java.sql.SQLException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EntradaSalidaServiceImpl implements EntradaSalidaService {

    private final EntradaSalidaRepository entradaSalidaRepository;

    public EntradaSalidaServiceImpl(EntradaSalidaRepository entradaSalidaRepository) {
        this.entradaSalidaRepository = entradaSalidaRepository;
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

        // 4. Buscar el monto a pagar basado en el tipo de pensión del usuario
        Double montoPago = obtenerMontoPorTipoPension(dto.getUsuario());
        entradaSalida.setCantidadPago(montoPago);

        // 5. Verificar si la pensión va a caducar en el día en curso
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
        return null;
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

    // Método privado para obtener el monto según el tipo de pensión del usuario
    private Double obtenerMontoPorTipoPension(Usuario usuario) {
        // Asumiendo que existe un método en el usuario para obtener su pensión activa
        if (usuario.getPensionActiva() != null) {
            return usuario.getPensionActiva().getCosto();
        }
        return 0.0;
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
