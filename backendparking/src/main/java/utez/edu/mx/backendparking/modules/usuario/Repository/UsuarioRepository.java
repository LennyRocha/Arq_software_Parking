package utez.edu.mx.backendparking.modules.usuario.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import utez.edu.mx.backendparking.modules.usuario.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Usuario findByCorreo(String Correo);

    
} 