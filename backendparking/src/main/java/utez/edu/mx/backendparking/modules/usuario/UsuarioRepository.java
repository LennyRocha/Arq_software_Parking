package utez.edu.mx.backendparking.modules.usuario;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Usuario findByCorreo(String Correo);

    boolean existsByCorreo(String correo);
} 