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
            return ApiResponse.success(HttpStatus.NO_CONTENT,"No tienes vehículos registrados todavía", dtos);
        }
        return ApiResponse.success(HttpStatus.OK,"Vehículos disponibles", dtos);
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
                    .bodyToMono(Usuario.class).block();
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
        catch (Exception e){
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
    public ApiResponse<Vehiculo> deleteVehiculo(Long id) {
        try{
            Vehiculo vehiculo = vehiculoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("El vehículo que deseas cambiar su estatua no existe"));
            vehiculo.setEstatus(!vehiculo.getEstatus());
            vehiculo = vehiculoRepository.save(vehiculo);
            return ApiResponse.success(HttpStatus.OK,"Ha cambiado el estatus del vehículo a "+vehiculo.getEstatus(), vehiculo);
        } catch (Exception e){
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,e.getMessage(), null);
        }
    }
}
