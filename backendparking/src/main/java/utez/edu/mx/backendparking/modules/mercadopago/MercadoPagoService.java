package utez.edu.mx.backendparking.modules.mercadopago;

import com.mercadopago.client.preference.*;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import utez.edu.mx.backendparking.modules.mercadopago.dto.PreferenciaRequest;
import utez.edu.mx.backendparking.modules.mercadopago.dto.PreferenciaResponse;
import utez.edu.mx.backendparking.modules.pension.Pension;
import utez.edu.mx.backendparking.modules.pension.PensionRepository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class MercadoPagoService {

    private static final Logger logger = LoggerFactory.getLogger(MercadoPagoService.class);
    private final PensionRepository pensionRepository;

    @Value("${mercadopago.success.url}")
    private String successUrl;

    @Value("${mercadopago.failure.url}")
    private String failureUrl;

    @Value("${mercadopago.pending.url}")
    private String pendingUrl;

    public MercadoPagoService(PensionRepository pensionRepository) {
        this.pensionRepository = pensionRepository;
    }

    public PreferenciaResponse crearPreferencia(PreferenciaRequest request) throws MPException, MPApiException {
        logger.info("Iniciando creación de preferencia para pensionId: {}", request.getPensionId());
        logger.info("URLs configuradas - Success: {}, Failure: {}, Pending: {}", 
            successUrl, failureUrl, pendingUrl);
        
        // Buscar la pensión por ID
        Pension pension = pensionRepository.findById(request.getPensionId())
                .orElseThrow(() -> {
                    logger.error("Pensión no encontrada con ID: {}", request.getPensionId());
                    return new RuntimeException("Pensión no encontrada con ID: " + request.getPensionId());
                });

        logger.info("Pensión encontrada: {} - Costo: {}", pension.getNombre(), pension.getCosto());

        // Validar que las URLs de retorno estén configuradas
        if (successUrl == null || successUrl.isEmpty()) {
            throw new RuntimeException("La URL de éxito no está configurada. Verifica mercadopago.success.url en application.properties");
        }
        if (failureUrl == null || failureUrl.isEmpty()) {
            throw new RuntimeException("La URL de fallo no está configurada. Verifica mercadopago.failure.url en application.properties");
        }
        if (pendingUrl == null || pendingUrl.isEmpty()) {
            throw new RuntimeException("La URL de pendiente no está configurada. Verifica mercadopago.pending.url en application.properties");
        }
        
        logger.info("URLs validadas correctamente");

        // Crear el item de la preferencia
        PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                .id(pension.getId().toString())
                .title("Pensión parKing - " + pension.getNombre())
                .description("Estacionamiento por " + pension.getDuracionDias() + " días")
                .pictureUrl("https://via.placeholder.com/150") //  cambiar esto por nuestro logo
                .categoryId("parking")
                .quantity(1)
                .currencyId("MXN")
                .unitPrice(new BigDecimal(pension.getCosto()))
                .build();

        List<PreferenceItemRequest> items = new ArrayList<>();
        items.add(itemRequest);

        // Configurar URLs de retorno
        PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                .success(successUrl)
                .failure(failureUrl)
                .pending(pendingUrl)
                .build();
        
        logger.info("BackUrls creado - Success: {}, Failure: {}, Pending: {}", 
            backUrls.getSuccess(), backUrls.getFailure(), backUrls.getPending());

        // Configurar payer (comprador)
        PreferencePayerRequest payer = PreferencePayerRequest.builder()
                .name(request.getUsuarioNombre())
                .email(request.getUsuarioEmail())
                .build();

        // Crear la preferencia (sin autoReturn por ahora para evitar el conflicto)
        PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                .items(items)
                .backUrls(backUrls)
                // .autoReturn("approved")  // Comentado temporalmente - causa conflicto con MP
                .payer(payer)
                .externalReference("pension-" + pension.getId())
                .statementDescriptor("PARKING " + pension.getNombre())
                .build();

        // Crear el cliente y enviar la preferencia
        logger.info("Enviando preferencia a Mercado Pago...");
        logger.info("ExternalReference: {}, StatementDescriptor: {}", 
            "pension-" + pension.getId(), "PARKING " + pension.getNombre());
        
        PreferenceClient client = new PreferenceClient();
        Preference preference = client.create(preferenceRequest);

        logger.info("Preferencia creada con éxito - ID: {}", preference.getId());
        logger.info("Init Point (producción): {}", preference.getInitPoint());
        logger.info("Sandbox Init Point (pruebas): {}", preference.getSandboxInitPoint());

        // Retornar la respuesta
        PreferenciaResponse response = new PreferenciaResponse(
            preference.getId(), 
            preference.getInitPoint(), 
            preference.getSandboxInitPoint()
        );
        
        logger.info("Response que se enviará - ID: {}, InitPoint: {}, SandboxInitPoint: {}", 
            response.getId(), response.getInitPoint(), response.getSandboxInitPoint());
        
        return response;
    }
}
