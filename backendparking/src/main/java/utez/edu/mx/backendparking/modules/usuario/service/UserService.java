package utez.edu.mx.backendparking.modules.usuario.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.backendparking.modules.usuario.Usuario;
import utez.edu.mx.backendparking.modules.usuario.UsuarioRepository;
import utez.edu.mx.backendparking.shared.exception.ResourceNotFoundException;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public Usuario getOneForBackend(Long id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        return usuario.orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }
}
