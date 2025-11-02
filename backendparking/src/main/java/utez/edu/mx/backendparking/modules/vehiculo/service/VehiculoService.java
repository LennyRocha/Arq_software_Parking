package utez.edu.mx.backendparking.modules.vehiculo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;
import utez.edu.mx.backendparking.modules.tipovehiculo.model.TipoVehiculo;
import utez.edu.mx.backendparking.modules.usuario.model.Usuario;
import utez.edu.mx.backendparking.modules.vehiculo.model.Vehiculo;
import utez.edu.mx.backendparking.modules.vehiculo.model.VehiculoDto;
import utez.edu.mx.backendparking.modules.vehiculo.repository.VehiculoRepository;
import utez.edu.mx.backendparking.shared.api.ApiResponse;
import utez.edu.mx.backendparking.shared.exception.BadRequestException;
import utez.edu.mx.backendparking.shared.exception.ConflictException;
import utez.edu.mx.backendparking.shared.exception.ResourceNotFoundException;
import utez.edu.mx.backendparking.shared.webClient.WebClientConfig;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VehiculoService  {

    final String userEndpoint = "http://localhost:8080/usuarios/backend";
    final String typesEndpoint = "http://localhost:8080/vehiculos/tipos/backend";

    @Autowired
    private VehiculoRepository vehiculoRepository;

    @Autowired
    private WebClientConfig webClientConfig;

    @Transactional(readOnly = true)
    public ApiResponse<List<VehiculoDto>> getAllVehiculos() {
        List<Vehiculo> vehiculos = vehiculoRepository.findAll();
        List<VehiculoDto> dtos = vehiculos.stream()
                .map(VehiculoDto::fromEntity)
                .toList();
        if (vehiculos.isEmpty()) {
            return ApiResponse.success(HttpStatus.NO_CONTENT,"No hay vehículos disponibles", dtos);
        }
        return ApiResponse.success(HttpStatus.OK,"Vehículos disponibles", dtos);
    }

    @Transactional(readOnly = true, rollbackFor = Exception.class)
    public ApiResponse<List<VehiculoDto>> getAllVehiculosPerUser(
            Long user_id,
            Integer vehiculo_id,
            String query,
            Boolean getActive,
            Boolean getWithPlaca
    ) {
        try {
            // Validar que el usuario exista
            Usuario user = webClientConfig.createClient(userEndpoint).get()
                    .uri("/{id}", user_id)
                    .retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError,
                            resp -> Mono.error(new ResourceNotFoundException("Usuario no encontrado")))
                    .onStatus(HttpStatusCode::is5xxServerError,
                            resp -> Mono.error(new BadRequestException("Error en servicio de usuarios")))
                    .bodyToMono(Usuario.class)
                    .block();

            // Validar tipo de vehículo si se proporciona
            TipoVehiculo tipoVehiculo = null;
            if (vehiculo_id != null) {
                tipoVehiculo = webClientConfig.createClient(typesEndpoint).get()
                        .uri("/{id}", vehiculo_id)
                        .retrieve()
                        .onStatus(HttpStatusCode::is4xxClientError,
                                resp -> Mono.error(new ResourceNotFoundException("Tipo de vehículo no encontrado")))
                        .onStatus(HttpStatusCode::is5xxServerError,
                                resp -> Mono.error(new BadRequestException("Error en servicio de vehículos")))
                        .bodyToMono(TipoVehiculo.class)
                        .block();
            }

            // Normalizar parámetros
            query = (query != null) ? query.trim() : "";
            boolean filterActive = (getActive != null) ? getActive : false;
            boolean filterWithPlaca = (getWithPlaca != null) ? getWithPlaca : false;

            // Obtener todos los vehículos y aplicar filtros
            String finalQuery = query;
            List<VehiculoDto> dtos = vehiculoRepository.findAll().stream()
                    .filter(v -> v.getUsuario().getId().equals(user_id))
                    .filter(v -> vehiculo_id == null || v.getTipoVehiculo().getId().equals(vehiculo_id))
                    .filter(v -> finalQuery.isEmpty() ||
                            v.getModelo().toLowerCase().contains(finalQuery.toLowerCase()) ||
                            (v.getDescripcion() != null && v.getDescripcion().toLowerCase().contains(finalQuery.toLowerCase())))
                    .filter(v -> v.getEstatus() == filterActive)
                    .filter(v -> !filterWithPlaca || v.getPlaca() != null)
                    .map(VehiculoDto::fromEntity)
                    .toList();

            if (dtos.isEmpty()) {
                return ApiResponse.success(HttpStatus.NO_CONTENT, "No tienes vehículos registrados todavía", dtos);
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
        return ApiResponse.success(HttpStatus.OK,"Vehículo obtenido",
                vehiculoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Vehículo no encontrado") )
        );
    }

    @Transactional(rollbackFor = Exception.class)
    public ApiResponse<Vehiculo> createVehiculo(VehiculoDto vDto) {
        try{
            vDto.setEstatus(true);
            Usuario user = webClientConfig.createClient(userEndpoint).get()
                    .uri("/{id}",vDto.getIdUsuario())
                    .retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError, resp -> Mono.error(new ResourceNotFoundException("Usuario no encontrado")))
                    .onStatus(HttpStatusCode::is5xxServerError, resp -> Mono.error(new BadRequestException("Error en servicio de usuarios")))
                    .bodyToMono(Usuario.class)
                    .block();
            TipoVehiculo tipoVehiculo = webClientConfig.createClient(typesEndpoint).get()
                    .uri("/{id}",vDto.getIdTipoVehiculo())
                    .retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError, resp -> Mono.error(new ResourceNotFoundException("Tipo de vehículo no encontrado")))
                    .onStatus(HttpStatusCode::is5xxServerError, resp -> Mono.error(new BadRequestException("Error en servicio de vehículos")))
                    .bodyToMono(TipoVehiculo.class)
                    .block();
            Vehiculo vehiculo = vDto.toEntity();
            vehiculo.setUsuario(user);
            vehiculo.setTipoVehiculo(tipoVehiculo);
            vehiculo = vehiculoRepository.save(vehiculo);
            return ApiResponse.success(HttpStatus.CREATED,"¡Vehículo registrado correctamente!", vehiculo);
        }
        catch (ResourceNotFoundException ex) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, ex.getMessage(), null);
        } catch (BadRequestException ex) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, ex.getMessage(), null);
        } catch (Exception e){
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,e.getMessage(), null);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public ApiResponse<Vehiculo> updateVehiculo(Long id, VehiculoDto vDto) {
        try{
            Vehiculo vehiculo = vehiculoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("El vehículo que deseas modificar no existe"));
            vehiculo.setId(id);
            vehiculo.setEstatus(vDto.isEstatus());
            vehiculo.setModelo(vDto.getModelo());
            vehiculo.setDescripcion(vDto.getDescripcion());
            vehiculo.setPlaca(vDto.getPlaca());
            vehiculo = vehiculoRepository.save(vehiculo);
            return ApiResponse.success(HttpStatus.OK,"Vehículo registrado correctamente", vehiculo);
        }
        catch (Exception e){
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,e.getMessage(), null);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public ApiResponse<Void> deleteVehiculo(Long id) {
        try{
            Vehiculo vehiculo = vehiculoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("El vehículo que deseas cambiar su estatua no existe"));
            vehiculo.setEstatus(!vehiculo.getEstatus());
            vehiculo = vehiculoRepository.save(vehiculo);
            return ApiResponse.success(HttpStatus.OK,"Ha cambiado el estatus del vehículo a "+vehiculo.getEstatus(), null);
        } catch (Exception e){
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,e.getMessage(), null);
        }
    }
}
