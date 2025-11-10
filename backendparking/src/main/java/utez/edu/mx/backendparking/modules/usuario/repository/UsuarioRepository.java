package utez.edu.mx.backendparking.modules.usuario.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import utez.edu.mx.backendparking.modules.usuario.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}
