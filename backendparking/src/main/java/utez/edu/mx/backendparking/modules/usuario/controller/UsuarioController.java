package utez.edu.mx.backendparking.modules.usuario.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import utez.edu.mx.backendparking.modules.usuario.UsuarioService;
import utez.edu.mx.backendparking.modules.usuario.Request.UsuarioRequest;
import utez.edu.mx.backendparking.modules.usuario.model.Usuario;
import utez.edu.mx.backendparking.shared.api.ApiResponse;

@RestController
@RequestMapping("/api")
public class UsuarioController {
    
    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> createUser(@RequestBody UsuarioRequest usuarioRequest) {
        ApiResponse<?> response = usuarioService.createUser(usuarioRequest);
        
        return ResponseEntity
            .status(response.getStatus())
            .body(response);
    }

    @GetMapping("usuarios/backend/{id}")
    public Usuario getUserForBackend(@PathVariable("id") Long id) {
        return usuarioService.getUserForBackend(id);
    }
}