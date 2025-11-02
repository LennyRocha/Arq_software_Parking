package utez.edu.mx.backendparking.modules.cajon.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import utez.edu.mx.backendparking.modules.cajon.model.Cajon;

import java.util.List;
import java.util.Optional;

public interface CajonRepository extends JpaRepository<Cajon, Long> {

    boolean existsByNameAndIdNot(String name, Long id);
    Optional<Cajon> findByName(String name);
    Optional<Cajon> findByUbicacion(String ubicacion);
    List<Cajon> findAllByPiso(int piso);
    @Query(value = "SELECT * FROM Cajon ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Cajon findRandomCajon();

}
