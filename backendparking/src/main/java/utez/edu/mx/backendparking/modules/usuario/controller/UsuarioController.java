package utez.edu.mx.backendparking.modules.usuario.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import utez.edu.mx.backendparking.modules.usuario.Usuario;
import utez.edu.mx.backendparking.modules.usuario.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UsuarioController {

    private final UserService userService;

    public UsuarioController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/backend/{id}")
    public Usuario getUsuarioForBackend(Long id) {
        return userService.getOneForBackend(id);
    }

}