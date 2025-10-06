package utez.edu.mx.backendparking.modules.pension.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PensionRepository extends JpaRepository<Pension, Long> {
    Optional<Pension> findByDuracionDiasAndCosto(int duracionDias, Double costo);

    boolean existsByDuracionDiasAndCosto(int duracionDias, Double costo);
}
