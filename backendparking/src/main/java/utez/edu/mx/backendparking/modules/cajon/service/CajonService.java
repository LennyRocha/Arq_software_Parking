package utez.edu.mx.backendparking.modules.cajon.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import utez.edu.mx.backendparking.config.MessagesInterface;
import utez.edu.mx.backendparking.modules.cajon.model.Cajon;
import utez.edu.mx.backendparking.modules.cajon.model.CajonDto;
import utez.edu.mx.backendparking.modules.cajon.repository.CajonRepository;
import utez.edu.mx.backendparking.shared.api.ApiResponse;
import utez.edu.mx.backendparking.shared.exception.BadRequestException;
import utez.edu.mx.backendparking.shared.exception.ConflictException;
import utez.edu.mx.backendparking.shared.exception.ResourceNotFoundException;
import utez.edu.mx.backendparking.shared.webClient.WebClientConfig;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@Service
public class CajonService {
    //private  final Logger log = Logger.getLogger(CajonService.class.getName());
    @Autowired
    private CajonRepository cajonRepository;

    @Autowired
    private SimpMessagingTemplate template;

    @Value("${websocket.server.url}")
    private String websocketServerUrl;

    @Autowired
    private WebClientConfig webClientConfig;

    private void refresh(){
        List<Cajon> cajones = cajonRepository.findAll();
        ApiResponse<List<Cajon>> response = ApiResponse.success(HttpStatus.OK, "Cajones actualizados", cajones);
        template.convertAndSend("/topic/cajones", response);
    }

    private void updateNodeServer() {
        List<Cajon> cajones = cajonRepository.findAll();
        ApiResponse<List<Cajon>> response = ApiResponse.success(HttpStatus.OK, "Cajones actualizados", cajones);
        Map<String, Object> payload = new HashMap<>();
        payload.put("datos", response);

        webClientConfig.createClient(websocketServerUrl).post()
                .uri("/notify")
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(String.class)
                .doOnError(error -> System.err.println("Error: " + error.getMessage()))
                .subscribe();
    }

    @Transactional(readOnly = true, rollbackFor = Exception.class)
    public ApiResponse<Map<String, Object>> getCajonesPaginated(String sort, String query, Integer pageNumber, Integer pageSize){
        try {
            PageRequest request = PageRequest.of(pageNumber, pageSize, Sort.by(sort.isBlank() ? "id" : sort).ascending());
            Page<Cajon> cajonPage;
            if(query.isBlank()){
                cajonPage = cajonRepository.findAll(request);
            } else {
                cajonPage = cajonRepository.findAllByNameContainingIgnoreCaseOrUbicacionContainingIgnoreCase(query,query,request);
            }
            List<Cajon> cajones = cajonPage.getContent().stream().toList();
            Map<String, Object> data = new HashMap<>();
            data.put("paginas", cajonPage.getTotalPages());
            data.put("pagina", cajonPage.getNumber() + 1);
            data.put("tamaño", cajonPage.getTotalElements());
            data.put("maximo", pageSize);
            data.put("totalElementos", cajonRepository.count());
            data.put("orden", sort.isBlank() ? "default" : sort);
            data.put("elementos", cajones);
            if(cajones.isEmpty()) return ApiResponse.success(HttpStatus.NO_CONTENT,"No hay cajones disponibles", data);
            return ApiResponse.success(HttpStatus.OK, "Cajones recuperados por página: "+cajonPage.getTotalElements(), data);
        } catch (Exception e) {
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,e.getMessage(), null);
        }
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<Cajon>> getCajones(int piso, int id_vehiculo){
        String causa = "";
        try {
            List<Cajon> cajones;
            if(piso != 0 && id_vehiculo != 0){
                cajones = cajonRepository.findAllByPisoAndTipoVehiculoId(piso, id_vehiculo);
            } else if (piso != 0) {
                cajones = cajonRepository.findAllByPiso(piso);
                if (cajones.isEmpty()) { causa = "No hay cajones disponibles para ese piso"; }
            } else if (id_vehiculo != 0){
                cajones = cajonRepository.findAllByTipoVehiculoId(id_vehiculo);
                if (cajones.isEmpty()) { causa = "No hay cajones disponibles para ese tipo de vehículo"; }
            } else {
                cajones = cajonRepository.findAll();
            }
            if(cajones.isEmpty()) return ApiResponse.success(HttpStatus.NO_CONTENT,causa.isBlank() ? "No hay cajones disponibles para esa combinación" : causa, cajones);
            return ApiResponse.success(HttpStatus.OK, "Cajones recuperados", cajones);
        } catch (Exception e) {
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,e.getMessage(), null);
        }
    }

    @Transactional(readOnly = true)
    public ApiResponse<Cajon> getCajonPorId(Long id){
        return ApiResponse.success(HttpStatus.OK,"Cajón obtenido",
                cajonRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cajón no encontrado"))
        );
    }

    @Transactional(readOnly = true)
    public ApiResponse<Cajon> getCajonPorIdentificador(String id){
        return ApiResponse.success(HttpStatus.OK,"Cajón obtenido",
                cajonRepository.findByName(id).orElseThrow(() -> new ResourceNotFoundException("Cajón no encontrado") )
        );
    }

    @Transactional(readOnly = true)
    public ApiResponse<Cajon> getCajonPorUbicacion(String ubic){
        return ApiResponse.success(HttpStatus.OK,"Cajón obtenido",
                cajonRepository.findByUbicacion(ubic).orElseThrow(() -> new ResourceNotFoundException("Cajón no encontrado") )
        );
    }

    @Transactional(rollbackFor = {Exception.class, BadRequestException.class, ConflictException.class})
    public ApiResponse<Cajon> createCajon(CajonDto cDto){
        try{
            cDto.setEstatus(Boolean.TRUE);
            cDto.setParaPensionados(Boolean.FALSE);
            Cajon cajon = cDto.toEntity();
            cajon = cajonRepository.save(cajon);
            refresh();
            updateNodeServer();
            return ApiResponse.success(HttpStatus.CREATED, "Cajón registrado correctamente",cajon);
        } catch (BadRequestException ex) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, ex.getMessage(), null);
        } catch (ConflictException ex) {
            return ApiResponse.error(HttpStatus.CONFLICT, ex.getMessage(), null);
        } catch (Exception e){
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,e.getMessage(), null);
        }
    }

    @Transactional(rollbackFor = {Exception.class, BadRequestException.class, ConflictException.class})
    public ApiResponse<List<Cajon>> createCajones(List<CajonDto> cDtos){
        try{
            List<Cajon> cajones = cDtos.stream()
                    .peek(dto -> dto.setEstatus(Boolean.TRUE))
                    .map(CajonDto::toEntity)
                    .toList();
            List<Cajon> saved = cajonRepository.saveAll(cajones);
            refresh();
            updateNodeServer();
            return ApiResponse.success(HttpStatus.CREATED, "Cajones registrados correctamente", saved);
        } catch (BadRequestException ex) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, ex.getMessage(), null);
        } catch (ConflictException ex) {
            return ApiResponse.error(HttpStatus.CONFLICT, ex.getMessage(), null);
        } catch (Exception e){
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,e.getMessage(), null);
        }
    }

    @Transactional(rollbackFor = {Exception.class, BadRequestException.class, ConflictException.class})
    public ApiResponse<Cajon> updateCajon(Long id, CajonDto cDto){
        try{
            Cajon cajon = cajonRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cajón no encontrado"));
            cajon.setUbicacion(cDto.getUbicacion());
            cajon.setName(cDto.getName());
            cajon.setPiso(cDto.getPiso());
            cajon.setTipoVehiculo(cDto.getTipoVehiculo());
            cajon.setDisponible(cDto.getDisponible());
            cajon.setParaPensionados(cDto.getParaPensionados());
            cajon.setEstatus(cDto.isEstatus());
            cajon = cajonRepository.save(cajon);
            refresh();
            updateNodeServer();
            return ApiResponse.success(HttpStatus.OK, "Cajón registrado correctamente",cajon);
        } catch (BadRequestException ex) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, ex.getMessage(), null);
        } catch (ConflictException ex) {
            return ApiResponse.error(HttpStatus.CONFLICT, ex.getMessage(), null);
        } catch (Exception e){
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,e.getMessage(), null);
        }
    }

    @Transactional(rollbackFor = {Exception.class, BadRequestException.class, ConflictException.class})
    public ApiResponse<Cajon> cambiarDisponibilidad(boolean paraOcupar){
        try{
            Cajon cajon;
            if(paraOcupar){
                cajon = cajonRepository.findRandomCajonToUse().orElseThrow(() -> new ResourceNotFoundException("Cajón no encontrado"));
            } else {
                cajon = cajonRepository.findRandomCajonToUnuse().orElseThrow(() -> new ResourceNotFoundException("Cajón no encontrado"));
            }
            cajon.setDisponible(!cajon.getDisponible());
            cajon = cajonRepository.save(cajon);
            refresh();
            updateNodeServer();
            return ApiResponse.success(HttpStatus.OK, paraOcupar ? "Cajón ocupado" : "Cajón desocupado",cajon);
        } catch (BadRequestException ex) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, ex.getMessage(), null);
        } catch (ConflictException ex) {
            return ApiResponse.error(HttpStatus.CONFLICT, ex.getMessage(), null);
        } catch (Exception e){
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,e.getMessage(), null);
        }
    }

    @Transactional(rollbackFor = {Exception.class, BadRequestException.class, ConflictException.class})
    public ApiResponse<Cajon> cambiarDisponibilidadForPensionados(boolean paraOcupar){
        try{
            Cajon cajon;
            if(paraOcupar){
                cajon = cajonRepository.findRandomCajonExclusivoToUse().orElseThrow(() -> new ResourceNotFoundException("Cajón no encontrado"));
            } else {
                cajon = cajonRepository.findRandomCajonExclusivoToUnuse().orElseThrow(() -> new ResourceNotFoundException("Cajón no encontrado"));
            }
            cajon.setDisponible(!cajon.getDisponible());
            cajon = cajonRepository.save(cajon);
            refresh();
            updateNodeServer();
            return ApiResponse.success(HttpStatus.OK, paraOcupar ? "Cajón ocupado" : "Cajón desocupado",cajon);
        } catch (BadRequestException ex) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, ex.getMessage(), null);
        } catch (ConflictException ex) {
            return ApiResponse.error(HttpStatus.CONFLICT, ex.getMessage(), null);
        } catch (Exception e){
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,e.getMessage(), null);
        }
    }

    @Transactional(rollbackFor = {Exception.class, BadRequestException.class, ConflictException.class})
    public ApiResponse<Cajon> deleteCajon(Long id){
        try{
            Cajon cajon = cajonRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cajón no encontrado"));
            boolean oldState = cajon.getEstatus();
            cajon.setEstatus(!cajon.getEstatus());
            cajon = cajonRepository.save(cajon);
            refresh();
            updateNodeServer();
            return ApiResponse.success(HttpStatus.OK, "Ha cambiado el estatus del cajón "+ cajon.getName() +" de "+ MessagesInterface.isActiveOrInactive(oldState) +" a "+MessagesInterface.isActiveOrInactive(cajon.getEstatus()),cajon);
        } catch (BadRequestException ex) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, ex.getMessage(), null);
        } catch (ConflictException ex) {
            return ApiResponse.error(HttpStatus.CONFLICT, ex.getMessage(), null);
        } catch (Exception e){
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,e.getMessage(), null);
        }
    }

    @Transactional(rollbackFor = {Exception.class, BadRequestException.class, ConflictException.class})
    public ApiResponse<List<Cajon>> setCajonesExclusivos(int conteo){
        try {
            List<Cajon> cajones = cajonRepository.findRandomCajones(conteo);
            if(cajones.isEmpty()){
                return ApiResponse.error(HttpStatus.NOT_FOUND, "Ya no hay más cajones disponibles para reservar", null);
            }
            cajones.forEach(cajon -> cajon.setDisponible(!cajon.getDisponible()));
            List<Cajon> saved = cajonRepository.saveAll(cajones);
            refresh();
            updateNodeServer();
            return ApiResponse.success(HttpStatus.CREATED, "Cajones reservados correctamente", saved);
        } catch (BadRequestException ex) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, ex.getMessage(), null);
        } catch (ConflictException ex) {
            return ApiResponse.error(HttpStatus.CONFLICT, ex.getMessage(), null);
        } catch (Exception e){
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,e.getMessage(), null);
        }
    }
}
