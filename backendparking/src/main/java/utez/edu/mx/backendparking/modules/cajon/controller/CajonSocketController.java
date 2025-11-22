package utez.edu.mx.backendparking.modules.cajon.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import utez.edu.mx.backendparking.modules.cajon.model.Cajon;
import utez.edu.mx.backendparking.modules.cajon.model.CajonRequest;
import utez.edu.mx.backendparking.modules.cajon.service.CajonService;
import utez.edu.mx.backendparking.shared.api.ApiResponse;

import java.util.List;

@Controller
public class CajonSocketController {

    @Autowired
    private CajonService cajonService;

    @MessageMapping("/cajones/get") // Cliente envía a /app/cajones
    @SendTo("/topic/cajones")   // Servidor responde a /topic/cajones
    public ApiResponse<List<Cajon>> getCajones(CajonRequest req) {
        return cajonService.getCajones(req.getPiso(), req.getIdCar());
    }
}
