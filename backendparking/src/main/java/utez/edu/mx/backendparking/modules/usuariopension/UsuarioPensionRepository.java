package utez.edu.mx.backendparking.modules.usuariopension;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioPensionRepository extends JpaRepository<UsuarioPension, Long> {

    // Metodo para buscar por id usuario y estado true
    Optional<UsuarioPension> findByUsuarioIdAndEstatusTrue(Long idUsuario);

    // Metodo para verificar si existe un UUID
    boolean existsByUuidCodigoQR(String uuidCodigoQR);

    // Metodo para buscar por UUID y estado true
    Optional<UsuarioPension> findByUuidCodigoQRAndEstatusTrue(String uuidCodigoQR);

    @Query("""
        SELECT up FROM UsuarioPension up 
        JOIN FETCH up.usuario u 
        JOIN FETCH up.pension p 
        WHERE (:search IS NULL OR :search = '' OR 
               LOWER(u.correo) LIKE LOWER(CONCAT('%', :search, '%')) OR 
               LOWER(p.nombre) LIKE LOWER(CONCAT('%', :search, '%')))
        """)
    Page<UsuarioPension> findAllWithUsuarioAndPension(Pageable pageable, @Param("search") String search);

    @Query("SELECT up FROM UsuarioPension up WHERE up.fechaFinalizacion < :fecha AND up.estatus = true")
    List<UsuarioPension> findPensionesVencidas(@Param("fecha") LocalDate fecha);

    @Query("SELECT up FROM UsuarioPension up WHERE up.usuario.id = :usuarioId")
    List<UsuarioPension> findByUsuarioId(@Param("usuarioId") Long usuarioId);
}
