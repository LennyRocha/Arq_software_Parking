package utez.edu.mx.backendparking.modules.tarifa;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import utez.edu.mx.backendparking.modules.tipovehiculo.model.TipoVehiculo;

import java.util.List;

@Repository
public interface TarifaRepository extends JpaRepository<Tarifa, Long> {
    boolean existsByTiempoAndTipoVehiculo(Integer tiempo, TipoVehiculo tipoVehiculo);

    List<Tarifa> findByEstatusOrderByTipoVehiculoNombreAscTiempoAsc(Boolean estatus);

    @Query("SELECT t FROM Tarifa t WHERE " +
           "(:search IS NULL OR t.tiempo = :search) AND " +
           "(:search IS NULL OR t.costo = :search)")
    List<Tarifa> findByFilters(@Param("search") Double search);

    List<Tarifa> findByTipoVehiculoAndEstatusOrderByTiempoAsc(TipoVehiculo tipoVehiculo, Boolean estatus);

    // Métodos para paginación con filtros
    @Query("SELECT t FROM Tarifa t WHERE " +
           ":search IS NULL OR t.tiempo = :search OR t.costo = :search")
    Page<Tarifa> findByFiltersPaginated(@Param("search") Double search, Pageable pageable);

    Page<Tarifa> findAll(Pageable pageable);
}
