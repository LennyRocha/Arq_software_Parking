package utez.edu.mx.backendparking.modules.tarifa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import utez.edu.mx.backendparking.modules.tipovehiculo.TipoVehiculo;

import java.util.List;

@Repository
public interface TarifaRepository extends JpaRepository<Tarifa, Long> {
    boolean existsByTiempoAndTipoVehiculo(Integer tiempo, TipoVehiculo tipoVehiculo);

    List<Tarifa> findByEstatusOrderByTipoVehiculoNombreAscTiempoAsc(Boolean estatus);

    @Query("SELECT t FROM Tarifa t WHERE " +
           "(:tiempo IS NULL OR t.tiempo = :tiempo) AND " +
           "(:costo IS NULL OR t.costo = :costo)")
    List<Tarifa> findByFilters(@Param("tiempo") Integer tiempo, @Param("costo") Double costo);
}
