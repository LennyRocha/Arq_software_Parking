package utez.edu.mx.backendparking.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();

        // Permitir credenciales (cookies, authorization headers, etc.)
        corsConfiguration.setAllowCredentials(true);

        // Orígenes permitidos (frontend)
        corsConfiguration.setAllowedOrigins(Arrays.asList(
                "http://127.0.0.1:2000",      // Live server
                "http://localhost:3000",      // React/Next.js
                "http://localhost:4200",      // Angular
                "http://localhost:5173",
                 "http://localhost:5174",      // Vite
                "http://localhost:8081",      // Vue u Expo
                "http://localhost:5000"       // Servidor con Socket.io
        ));

        // Headers permitidos
        corsConfiguration.setAllowedHeaders(Arrays.asList(
                "Origin",
                "Content-Type",
                "Accept",
                "Authorization",
                "X-Requested-With",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
        ));

        // Headers expuestos al cliente
        corsConfiguration.setExposedHeaders(Arrays.asList(
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Credentials",
                "Authorization"
        ));

        // Métodos HTTP permitidos
        corsConfiguration.setAllowedMethods(Arrays.asList(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
        ));

        // Tiempo máximo de cache de la configuración CORS (en segundos)
        corsConfiguration.setMaxAge(3600L);

        // Aplicar configuración a todas las rutas
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);

        return new CorsFilter(source);
    }
}
