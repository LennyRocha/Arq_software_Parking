package utez.edu.mx.backendparking.modules.usuariopension;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import utez.edu.mx.backendparking.modules.usuario.model.Usuario;

import java.util.Optional;

@Repository
public interface UsuarioPensionRepository extends JpaRepository<UsuarioPension, Long> {

     // Metodo para buscar por id usuario y estado true
     Optional<UsuarioPension> findByUsuarioIdAndStatusTrue(Long idUsuario);

}
