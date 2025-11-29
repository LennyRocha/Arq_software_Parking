package utez.edu.mx.backendparking.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import static org.springframework.security.config.Customizer.withDefaults;

import utez.edu.mx.backendparking.security.Filter.JWTAuthorizationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {

    private final JWTAuthorizationFilter jwtAuthorizationFilter;

    public WebSecurityConfig(JWTAuthorizationFilter jwtAuthorizationFilter) {
        this.jwtAuthorizationFilter = jwtAuthorizationFilter;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .cors(withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        //.requestMatchers("/api/auth/private/registrarEmpleado").hasRole("ADMINISTRADOR")

                        //----TIPOS DE PENSIONES. Lo gestiona totalmente EL ADMIN, SOLO HAY GETS ESPECIFICOS PARA FRONT SIN AUTENTICACION
                        .requestMatchers("/api/pension/private/**").hasRole("ADMINISTRADOR")
                        .requestMatchers("/api/pension/public/**").permitAll() //para los gets en la landing page
                        //---PENSIONES DE USUARIO
                        .requestMatchers("/api/pensionado/public/**").permitAll()//porque hay registro publico desde la landing page
                        .requestMatchers("/api/pensionado/private/**").hasAnyRole("ADMINISTRADOR","EMPLEADO")
                        .requestMatchers("/api/pensionado/cliente/**").hasRole("CLIENTE_PENSIONADO")

                        .anyRequest().permitAll())
                .addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}