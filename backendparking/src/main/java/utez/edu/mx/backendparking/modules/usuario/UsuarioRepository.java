package utez.edu.mx.backendparking.modules.usuario.Repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import utez.edu.mx.backendparking.modules.usuario.model.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Usuario findByCorreo(String Correo);

    
} 