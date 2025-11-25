package utez.edu.mx.backendparking.modules.mercadopago;

import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.backendparking.modules.mercadopago.dto.PreferenciaRequest;
import utez.edu.mx.backendparking.modules.mercadopago.dto.PreferenciaResponse;
import utez.edu.mx.backendparking.shared.api.ApiResponse;

@RestController
@RequestMapping("/api/mercadopago")
@CrossOrigin(origins = {"http://localhost:5173"})
public class MercadoPagoController {

    private static final Logger logger = LoggerFactory.getLogger(MercadoPagoController.class);
    private final MercadoPagoService mercadoPagoService;

    public MercadoPagoController(MercadoPagoService mercadoPagoService) {
        this.mercadoPagoService = mercadoPagoService;
    }

    @PostMapping("/crear-preferencia")
    public ResponseEntity<ApiResponse<PreferenciaResponse>> crearPreferencia(
            @RequestBody @Valid PreferenciaRequest request) {
        logger.info("=== Inicio de solicitud crear-preferencia ===");
        logger.info("Request recibido - pensionId: {}, email: {}, nombre: {}", 
            request.getPensionId(), request.getUsuarioEmail(), request.getUsuarioNombre());
        
        try {
            PreferenciaResponse response = mercadoPagoService.crearPreferencia(request);
            logger.info("Preferencia creada exitosamente - ID: {}, Init Point: {}", 
                response.getId(), response.getInitPoint());
            return ResponseEntity.ok(ApiResponse.success(HttpStatus.OK,"Preferencia creada exitosamente",response));
        } catch (MPApiException e) {
            logger.error(" MPApiException - Status Code: {}, Message: {}", e.getStatusCode(), e.getMessage());
            
            // Extraer detalles del error de la respuesta de MP
            if (e.getApiResponse() != null) {
                logger.error("API Response - Status Code: {}", e.getApiResponse().getStatusCode());
                logger.error("API Response - Content: {}", e.getApiResponse().getContent());
                logger.error("API Response - Headers: {}", e.getApiResponse().getHeaders());
            }
            
            logger.error("Stack trace completo:", e);
            
            String errorDetail = e.getApiResponse() != null ? e.getApiResponse().getContent() : e.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 
                        "Error MP API [" + e.getStatusCode() + "]: " + errorDetail, null));
        } catch (MPException e) {
            logger.error("MPException general - Message: {}", e.getMessage());
            logger.error("Stack trace completo:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error al crear la preferencia de Mercado Pago: " + e.getMessage(),null));
        } catch (Exception e) {
            logger.error(" Exception inesperada - Type: {}, Message: {}", e.getClass().getName(), e.getMessage());
            logger.error("Stack trace completo:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error inesperado: " + e.getMessage(),null));
        } finally {
            logger.info("=== Fin de solicitud crear-preferencia ===");
        }
    }

}
