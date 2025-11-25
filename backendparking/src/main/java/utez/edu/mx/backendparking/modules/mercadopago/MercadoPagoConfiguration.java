package utez.edu.mx.backendparking.modules.mercadopago;

import com.mercadopago.MercadoPagoConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

@Configuration
public class MercadoPagoConfiguration {

    private static final Logger logger = LoggerFactory.getLogger(MercadoPagoConfiguration.class);

    @Value("${mercadopago.access.token}")
    private String accessToken;

    @PostConstruct
    public void init() {
        if (accessToken == null || accessToken.trim().isEmpty()) {
            logger.error("ERROR: mercadopago.access.token no está configurado en application.properties");
            throw new IllegalStateException("Mercado Pago Access Token no configurado");
        }
        
        String maskedToken = accessToken.length() > 20 
            ? accessToken.substring(0, 20) + "..." 
            : "***";
        logger.info("Configurando Mercado Pago SDK con Access Token: {}", maskedToken);
        
        MercadoPagoConfig.setAccessToken(accessToken);
        
        logger.info("Mercado Pago SDK configurado correctamente");
    }
}
