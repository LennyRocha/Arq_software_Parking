package utez.edu.mx.backendparking.modules.pension;

import org.springframework.data.jpa.repository.JpaRepository;
import utez.edu.mx.backendparking.modules.pension.Pension;

import java.util.Optional;

public interface PensionRepository extends JpaRepository<Pension, Long> {
    Optional<Pension> findByDuracionDiasAndCosto(int duracionDias, Double costo);

    boolean existsByDuracionDiasAndCosto(int duracionDias, Double costo);
}
