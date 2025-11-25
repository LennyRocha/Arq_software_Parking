package utez.edu.mx.backendparking.modules.vehiculo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;
import utez.edu.mx.backendparking.modules.entradasalida.EntradaSalida;
import utez.edu.mx.backendparking.modules.tipovehiculo.model.TipoVehiculo;
import utez.edu.mx.backendparking.modules.usuario.Usuario;
import utez.edu.mx.backendparking.modules.usuario.UsuarioRepository;
import utez.edu.mx.backendparking.modules.usuariopension.UsuarioPension;
import utez.edu.mx.backendparking.modules.usuariopension.UsuarioPensionRepository;
import utez.edu.mx.backendparking.modules.vehiculo.model.Vehiculo;
import utez.edu.mx.backendparking.modules.vehiculo.model.VehiculoDto;
import utez.edu.mx.backendparking.modules.vehiculo.model.VehiculoEstacionadoResponseDto;
import utez.edu.mx.backendparking.modules.vehiculo.model.VehiculoResponseDto;
import utez.edu.mx.backendparking.modules.vehiculo.repository.VehiculoRepository;
import utez.edu.mx.backendparking.security.SecurityUtils;
import utez.edu.mx.backendparking.shared.api.ApiResponse;
import utez.edu.mx.backendparking.shared.exception.BadRequestException;
import utez.edu.mx.backendparking.shared.exception.ResourceNotFoundException;
import utez.edu.mx.backendparking.shared.webClient.WebClientConfig;

import java.util.List;
import java.util.Optional;

@Service
public class VehiculoService {

    final String userEndpoint = "http://localhost:8080/api/usuarios/backend";
    final String typesEndpoint = "http://localhost:8080/api/vehiculos/tipos";

    @Autowired
    private VehiculoRepository vehiculoRepository;

    @Autowired
    private WebClientConfig webClientConfig;

    @Autowired
    private UsuarioPensionRepository usuarioPensionRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public ApiResponse<List<VehiculoDto>> getAllVehiculos() {
        List<Vehiculo> vehiculos = vehiculoRepository.findAll();
        List<VehiculoDto> dtos = vehiculos.stream().map(VehiculoDto::fromEntity).toList();
        if (vehiculos.isEmpty()) {
            return ApiResponse.success(HttpStatus.NO_CONTENT, "No hay vehículos disponibles", dtos);
        }
        return ApiResponse.success(HttpStatus.OK, "Vehículos disponibles", dtos);
    }

    @Transactional(readOnly = true, rollbackFor = {Exception.class, BadRequestException.class, ResourceNotFoundException.class})
    public ApiResponse<List<VehiculoDto>> getAllVehiculosPerUser(Long user_id, Integer vehiculo_id, String query, Boolean getActive, Boolean getWithPlaca) {
        try {
            // Validar que el usuario exista
            Usuario user = webClientConfig.createClient(userEndpoint).get().uri("/{id}", user_id).retrieve().onStatus(HttpStatusCode::is4xxClientError, resp -> Mono.error(new ResourceNotFoundException("Usuario no encontrado"))).onStatus(HttpStatusCode::is5xxServerError, resp -> Mono.error(new BadRequestException("Error en servicio de usuarios"))).bodyToMono(Usuario.class).block();

            // Validar tipo de vehículo si se proporciona
            TipoVehiculo tipoVehiculo = null;
            if (vehiculo_id != null) {
                tipoVehiculo = webClientConfig.createClient(typesEndpoint).get().uri("/{id}", vehiculo_id).retrieve().onStatus(HttpStatusCode::is4xxClientError, resp -> Mono.error(new ResourceNotFoundException("Tipo de vehículo no encontrado"))).onStatus(HttpStatusCode::is5xxServerError, resp -> Mono.error(new BadRequestException("Error en servicio de vehículos"))).bodyToMono(TipoVehiculo.class).block();
            }

            // Normalizar parámetros
            query = (query != null) ? query.trim() : "";
            Boolean filterActive = getActive;     // null = no filtrar
            Boolean filterWithPlaca = getWithPlaca;  // null = no filtrar

            String finalQuery = query;

            List<VehiculoDto> dtos = vehiculoRepository.findAll().stream()
                    // Por usuario
                    .filter(v -> v.getUsuario().getId().equals(user_id))
                    // Por tipo de vehículo
                    .filter(v -> vehiculo_id == null || v.getTipoVehiculo().getId().equals(vehiculo_id))
                    // Por búsqueda (modelo o descripción)
                    .filter(v -> finalQuery.isEmpty() || v.getModelo().toLowerCase().contains(finalQuery.toLowerCase()) || (v.getDescripcion() != null && v.getDescripcion().toLowerCase().contains(finalQuery.toLowerCase())))
                    // Filtrar por estatus SOLO si viene en el request
                    .filter(v -> filterActive == null || v.getEstatus() == filterActive)
                    // Filtrar por placa solo si está habilitado
                    .filter(v -> filterWithPlaca == null || (filterWithPlaca && v.getPlaca() != null)).map(VehiculoDto::fromEntity).toList();

            if (dtos.isEmpty()) {
                return ApiResponse.success(HttpStatus.NO_CONTENT, "No tienes vehículos registrados todavía o no coinciden con los filtros aplicados", dtos);
            }

            return ApiResponse.success(HttpStatus.OK, "Vehículos disponibles", dtos);

        } catch (ResourceNotFoundException ex) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, ex.getMessage(), null);
        } catch (BadRequestException ex) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, ex.getMessage(), null);
        } catch (Exception e) {
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), null);
        }
    }

    @Transactional(readOnly = true, rollbackFor = ResourceNotFoundException.class)
    public ApiResponse<Vehiculo> getVehiculoById(Long id) {
        return ApiResponse.success(HttpStatus.OK, "Vehículo obtenido", vehiculoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Vehículo no encontrado")));
    }

    @Transactional(rollbackFor = {Exception.class, BadRequestException.class, ResourceNotFoundException.class})
    public ApiResponse<Vehiculo> createVehiculo(VehiculoDto vDto) {
        try {
            vDto.setEstatus(true);
            Usuario user = webClientConfig.createClient(userEndpoint).get().uri("/{id}", vDto.getIdUsuario()).retrieve().onStatus(HttpStatusCode::is4xxClientError, resp -> Mono.error(new ResourceNotFoundException("Usuario no encontrado"))).onStatus(HttpStatusCode::is5xxServerError, resp -> Mono.error(new BadRequestException("Error en servicio de usuarios"))).bodyToMono(Usuario.class).block();
            TipoVehiculo tipoVehiculo = webClientConfig.createClient(typesEndpoint).get().uri("/{id}", vDto.getIdTipoVehiculo()).retrieve().onStatus(HttpStatusCode::is4xxClientError, resp -> Mono.error(new ResourceNotFoundException("Tipo de vehículo no encontrado"))).onStatus(HttpStatusCode::is5xxServerError, resp -> Mono.error(new BadRequestException("Error en servicio de vehículos"))).bodyToMono(TipoVehiculo.class).block();
            Vehiculo vehiculo = vDto.toEntity();
            vehiculo.setUsuario(user);
            vehiculo.setTipoVehiculo(tipoVehiculo);
            vehiculo = vehiculoRepository.save(vehiculo);
            return ApiResponse.success(HttpStatus.CREATED, "Vehículo registrado correctamente", vehiculo);
        } catch (ResourceNotFoundException ex) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, ex.getMessage(), null);
        } catch (BadRequestException ex) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, ex.getMessage(), null);
        } catch (Exception e) {
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), null);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public ApiResponse<Vehiculo> updateVehiculo(Long id, VehiculoDto vDto) {
        try {
            Vehiculo vehiculo = vehiculoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("El vehículo que deseas modificar no existe"));
            vehiculo.setId(id);
            vehiculo.setEstatus(vDto.isEstatus());
            vehiculo.setModelo(vDto.getModelo());
            vehiculo.setDescripcion(vDto.getDescripcion());
            vehiculo.setPlaca(vDto.getPlaca());
            vehiculo = vehiculoRepository.save(vehiculo);
            return ApiResponse.success(HttpStatus.OK, "Vehículo actualizado correctamente", vehiculo);
        } catch (Exception e) {
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), null);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public ApiResponse<Void> deleteVehiculo(Long id) {
        try {
            Vehiculo vehiculo = vehiculoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("El vehículo que deseas cambiar su estatua no existe"));
            boolean oldState = vehiculo.getEstatus();
            vehiculo.setEstatus(!vehiculo.getEstatus());
            vehiculo = vehiculoRepository.save(vehiculo);
            return ApiResponse.success(HttpStatus.OK, "Ha cambiado el estatus de" + vehiculo.getModelo() + " de " + oldState + " a " + vehiculo.getEstatus(), null);
        } catch (Exception e) {
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), null);
        }
    }

    /**
     * Verifica si el usuario autenticado tiene un vehículo estacionado actualmente
     * @return ApiResponse con información del vehículo estacionado o null si no tiene ninguno
     */
    @Transactional(readOnly = true)
    public ApiResponse<VehiculoEstacionadoResponseDto> verificarVehiculoEstacionado() {
        try {
            // Obtener el usuario autenticado actual
            //Usuario usuarioActual = SecurityUtils.getCurrentUser();
            Usuario usuarioActual = usuarioRepository.findById((long)3).get();

            // Buscar si el usuario tiene una pensión activa
            Optional<UsuarioPension> usuarioPensionOpt = usuarioPensionRepository.findByUsuarioIdAndEstatusTrue(usuarioActual.getId());

            if (usuarioPensionOpt.isEmpty()) {
                return ApiResponse.success(
                    HttpStatus.OK,
                    "No tienes una pensión activa",
                    new VehiculoEstacionadoResponseDto(false,null, null, null, null, "No tienes una pensión activa")
                );
            }

            UsuarioPension usuarioPension = usuarioPensionOpt.get();
            EntradaSalida ultimaEntrada = usuarioPension.getUltimaEntradaSalida();

            // Verificar si tiene una entrada registrada
            if (ultimaEntrada == null) {
                return ApiResponse.success(
                    HttpStatus.OK,
                    "No tienes ningún vehículo estacionado actualmente",
                    new VehiculoEstacionadoResponseDto(false, null, null, null, null, "No tienes ningún vehículo estacionado actualmente")
                );
            }

            // Verificar si la última entrada no tiene fecha de salida (significa que está estacionado)
            if (ultimaEntrada.getHoraSalida() == null) {
                Vehiculo vehiculoEstacionado = ultimaEntrada.getVehiculo();
                VehiculoDto vehiculoDto = VehiculoDto.fromEntity(vehiculoEstacionado);

                return ApiResponse.success(
                    HttpStatus.OK,
                    "Tienes un vehículo estacionado actualmente",
                    new VehiculoEstacionadoResponseDto(true, ultimaEntrada.getFecha(),
                            ultimaEntrada.getHoraEntrada(),
                            ultimaEntrada.getFolioTicket().toString(),
                            vehiculoDto, "Tienes un vehículo estacionado actualmente")
                );
            } else {
                return ApiResponse.success(
                    HttpStatus.OK,
                    "No tienes ningún vehículo estacionado actualmente",
                    new VehiculoEstacionadoResponseDto(false, null, null, null, null, "No tienes ningún vehículo estacionado actualmente")
                );
            }

        } catch (Exception e) {
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error al verificar vehículo estacionado: " + e.getMessage(), null);
        }
    }

    /**
     * Obtiene todos los vehículos del usuario autenticado
     * @return ApiResponse con la lista de vehículos del usuario
     */
    @Transactional(readOnly = true)
    public ApiResponse<List<VehiculoResponseDto>> getMisVehiculos() {
        try {
            // Obtener el usuario autenticado actual
            //Usuario usuarioActual = SecurityUtils.getCurrentUser();
            Usuario usuarioActual = usuarioRepository.findById((long)3).get();

            // Buscar todos los vehículos del usuario
            List<Vehiculo> vehiculos = vehiculoRepository.findByUsuarioId(usuarioActual.getId());

            // Convertir a VehiculoResponseDto
            List<VehiculoResponseDto> vehiculosDto = vehiculos.stream()
                    .map(VehiculoResponseDto::fromEntity)
                    .toList();

            if (vehiculosDto.isEmpty()) {
                return ApiResponse.success(
                    HttpStatus.OK,
                    "No tienes vehículos registrados",
                    vehiculosDto
                );
            }

            return ApiResponse.success(
                HttpStatus.OK,
                "Vehículos obtenidos correctamente",
                vehiculosDto
            );

        } catch (Exception e) {
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error al obtener tus vehículos: " + e.getMessage(), null);
        }
    }
}
