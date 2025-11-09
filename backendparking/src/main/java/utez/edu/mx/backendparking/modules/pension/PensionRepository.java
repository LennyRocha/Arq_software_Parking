package utez.edu.mx.backendparking.modules.pension;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PensionRepository extends JpaRepository<Pension, Long> {

    boolean existsByDuracionDiasAndCosto(int duracionDias, Double costo);

    // para verificar duplicados en actualizaciones, excluyendo el registro actual
    boolean existsByDuracionDiasAndCostoAndIdNot(int duracionDias, Double costo, Long id);

    // Búsqueda en múltiples campos
    @Query("SELECT p FROM Pension p WHERE " +
            "LOWER(p.nombre) LIKE LOWER(:searchTerm) OR " +
            "CAST(p.duracionDias AS string) LIKE :searchTerm OR " +
            "CAST(p.costo AS string) LIKE :searchTerm")
    Page<Pension> findBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);

    // Encontrar por estado
    Page<Pension> findByStatus(boolean status, Pageable pageable);
}
