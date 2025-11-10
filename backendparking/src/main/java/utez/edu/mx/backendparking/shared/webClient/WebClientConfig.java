package utez.edu.mx.backendparking.shared.webClient;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class WebClientConfig {

    public WebClient createClient (String baseUrl){
        return WebClient.builder().baseUrl(baseUrl).build();
    }
}
