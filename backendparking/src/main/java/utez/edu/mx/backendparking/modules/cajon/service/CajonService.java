package utez.edu.mx.backendparking.modules.cajon.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.backendparking.modules.cajon.model.Cajon;
import utez.edu.mx.backendparking.modules.cajon.model.CajonDto;
import utez.edu.mx.backendparking.modules.cajon.repository.CajonRepository;
import utez.edu.mx.backendparking.shared.api.ApiResponse;
import utez.edu.mx.backendparking.shared.exception.BadRequestException;
import utez.edu.mx.backendparking.shared.exception.ConflictException;
import utez.edu.mx.backendparking.shared.exception.ResourceNotFoundException;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
public class CajonService {
    @Autowired
    private CajonRepository cajonRepository;

    @Transactional(readOnly = true)
    public ApiResponse<List<Cajon>> getCajones(){
        List<Cajon> cajones = cajonRepository.findAll();
        if(cajones.isEmpty()) return ApiResponse.success(HttpStatus.NO_CONTENT,"No hay cajones disponibles", cajones);
        return ApiResponse.success(HttpStatus.OK, "Cajones recuperados", cajones);
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<Cajon>> getCajonesPorPiso(int piso){
        List<Cajon> cajones = cajonRepository.findAllByPiso(piso);
        if(cajones.isEmpty()) return ApiResponse.success(HttpStatus.NO_CONTENT,"No hay cajones disponibles para ese piso", cajones);
        return ApiResponse.success(HttpStatus.OK, "Cajones recuperados", cajones);
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
            Cajon cajon = cDto.toEntity();
            cajon = cajonRepository.save(cajon);
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
            List<Cajon> newCajones = new ArrayList<>();
            cDtos.forEach(cDto -> {
                cDto.setEstatus(Boolean.TRUE);
                Cajon cajon = cDto.toEntity();
                cajon = cajonRepository.save(cajon);
                newCajones.add(cajon);
            });
            return ApiResponse.success(HttpStatus.CREATED, "Cajones registrados correctamente",newCajones);
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
            cajon.setId(cDto.getId());
            cajon.setUbicacion(cDto.getUbicacion());
            cajon.setName(cDto.getName());
            cajon.setPiso(cDto.getPiso());
            cajon.setTipoVehiculo(cDto.getTipoVehiculo());
            cajon.setDisponible(cDto.getDisponible());
            cajon.setParaPensionados(cDto.getParaPensionados());
            cajon.setEstatus(cDto.isEstatus());
            cajon = cajonRepository.save(cajon);
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
    public ApiResponse<Cajon> ocuparCajon(Long id, CajonDto cDto){
        try{
            Cajon cajon = cajonRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cajón no encontrado"));
            cajon.setDisponible(!cDto.getDisponible());
            cajon = cajonRepository.save(cajon);
            return ApiResponse.success(HttpStatus.CREATED, "Cajón ocupado",cajon);
        } catch (BadRequestException ex) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, ex.getMessage(), null);
        } catch (ConflictException ex) {
            return ApiResponse.error(HttpStatus.CONFLICT, ex.getMessage(), null);
        } catch (Exception e){
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,e.getMessage(), null);
        }
    }

    @Transactional(rollbackFor = {Exception.class, BadRequestException.class, ConflictException.class})
    public ApiResponse<Cajon> deleteCajon(Long id, CajonDto cDto){
        try{
            Cajon cajon = cajonRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cajón no encontrado"));
            boolean oldState = cajon.getEstatus();
            cajon.setEstatus(!cDto.isEstatus());
            cajon = cajonRepository.save(cajon);
            return ApiResponse.success(HttpStatus.CREATED, "Ha cambiado el estatus del cajón "+ cajon.getName() +" de "+ oldState +" a "+cajon.getEstatus(),cajon);
        } catch (BadRequestException ex) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, ex.getMessage(), null);
        } catch (ConflictException ex) {
            return ApiResponse.error(HttpStatus.CONFLICT, ex.getMessage(), null);
        } catch (Exception e){
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,e.getMessage(), null);
        }
    }

    //TODO: Lista paginada para el admin y reservar cajones por número
}
