package utez.edu.mx.backendparking.modules.usuario.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import utez.edu.mx.backendparking.modules.login.LoginRequest;
import utez.edu.mx.backendparking.modules.usuario.Request.UsuarioRequest;
import utez.edu.mx.backendparking.modules.usuario.model.Usuario;
import utez.edu.mx.backendparking.modules.usuario.UsuarioService;


import utez.edu.mx.backendparking.shared.api.ApiResponse;

@RestController
@RequestMapping("/api")
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;

    /*

    Lo comente porque hay dos clases de UsuarioService, lo que pasa es que la otra clase no implementa la interfaz UsuarioService y por eso da conflicto
    @GetMapping("/backend/{id}")
    public Usuario getUsuarioForBackend(Long id) {
        return usuarioServ.get(id);
    }
    */

      @PostMapping("/RegistrarCliente")
    public ResponseEntity<ApiResponse<?>> createUser(@RequestBody UsuarioRequest usuarioRequest) {
        ApiResponse<?> response = usuarioService.createUser(usuarioRequest);

        return ResponseEntity
            .status(response.getStatus())
            .body(response);
    }
}
