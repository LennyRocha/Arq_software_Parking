package utez.edu.mx.backendparking.modules.entradasalida;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EntradaSalidaRepository extends JpaRepository<EntradaSalida, Long> {
    boolean existsByFolioTicket(Integer folioTicket);
    Optional<EntradaSalida> findByFolioTicket(Integer folioTicket);
}
