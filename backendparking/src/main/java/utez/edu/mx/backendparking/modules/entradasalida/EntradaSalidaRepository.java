package utez.edu.mx.backendparking.modules.entradasalida;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EntradaSalidaRepository extends JpaRepository<EntradaSalida, Long> {
    boolean existsByFolioTicket(Integer folioTicket);
    Optional<EntradaSalida> findByFolioTicket(Integer folioTicket);

    /*
    @Query("""
           SELECT DISTINCT e FROM EntradaSalida e LEFT JOIN e.usuario u 
           WHERE :search IS NULL OR :search = '' OR 
           CAST(e.folioTicket AS string) LIKE CONCAT('%', :search, '%') OR 
           LOWER(CONCAT(COALESCE(u.nombre, ''), ' ', COALESCE(u.apellidoPaterno, ''), ' ', COALESCE(u.apellidoMaterno, ''))) LIKE LOWER(CONCAT('%', :search, '%'))
           """)
    Page<EntradaSalida> findByFolioOrUsuarioNombre(@Param("search") String search, Pageable pageable);

     */
}
