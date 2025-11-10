package utez.edu.mx.backendparking.modules.cajon.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import utez.edu.mx.backendparking.modules.cajon.model.Cajon;

import java.util.List;
import java.util.Optional;

public interface CajonRepository extends JpaRepository<Cajon, Long> {

    boolean existsByNameAndIdNot(String name, Long id);
    Optional<Cajon> findByName(String name);
    Optional<Cajon> findByUbicacion(String ubicacion);
    List<Cajon> findAllByPiso(int piso);
    List<Cajon> findAllByTipoVehiculoId(int tipoVehiculoId);
    List<Cajon> findAllByPisoAndTipoVehiculoId(int piso, int tipoVehiculoId);
    @Query(value = "SELECT * FROM Cajon WHERE para_pensionados = false ORDER BY RAND() LIMIT :limit", nativeQuery = true)
    List<Cajon> findRandomCajones(@Param("limit") int limit);
    @Query(value = "SELECT * FROM Cajon ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Cajon findRandomCajon();
    Page<Cajon> findAllByNameContainingIgnoreCaseOrUbicacionContainingIgnoreCase(String name, String ubicacion, Pageable pageable);

}