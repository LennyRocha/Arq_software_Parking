package utez.edu.mx.backendparking.modules.entradasalida;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntradaSalidaRepository extends JpaRepository<EntradaSalida, Long> {
    boolean existsByFolioTicket(Integer folioTicket);
}
