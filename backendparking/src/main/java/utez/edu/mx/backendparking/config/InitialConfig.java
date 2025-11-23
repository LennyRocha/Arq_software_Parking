package utez.edu.mx.backendparking.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

@Configuration
public class InitialConfig implements CommandLineRunner {
    private final InitialDataService initialDataService;

    public InitialConfig(InitialDataService initialDataService) {
        this.initialDataService = initialDataService;
    }

    @Override
    public void run(String... args) {
        initialDataService.inicializarTiposDeVehiculo();
        initialDataService.inicializarTarifas();
        initialDataService.inicializarPensiones();
        initialDataService.inicializarRolesAndUserAdminAndEmployee();
        initialDataService.inicializarVehiculos();
    }

}
