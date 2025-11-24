package utez.edu.mx.backendparking.modules.usuariopension;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class UsuarioPensionScheduler {

    private final PensionadoService pensionadoService;

    public UsuarioPensionScheduler(PensionadoService pensionadoService) {
        this.pensionadoService = pensionadoService;
    }

    // TEMPORAL: Ejecuta cada minuto para pruebas
    //@Scheduled(cron = "0 * * * * ?")
    // Ejecuta todos los días a las 00:01
    @Scheduled(cron = "0 1 0 * * ?")
    public void actualizarPensionesVencidas() {
        System.out.println(" EJECUTANDO SCHEDULER - " + LocalDateTime.now());
        pensionadoService.actualizarPensionesVencidas();
    }
}
