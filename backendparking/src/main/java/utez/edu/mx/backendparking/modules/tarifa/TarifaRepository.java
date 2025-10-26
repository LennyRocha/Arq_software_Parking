package utez.edu.mx.backendparking.modules.tarifa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import utez.edu.mx.backendparking.modules.pension.Pension;

@Repository
public interface TarifaRepository extends JpaRepository<Pension, Long> {
}
