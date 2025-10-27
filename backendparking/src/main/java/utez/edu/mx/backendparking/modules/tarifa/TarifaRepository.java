package utez.edu.mx.backendparking.modules.tarifa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import utez.edu.mx.backendparking.modules.tipovehiculo.TipoVehiculo;

import java.util.List;

@Repository
public interface TarifaRepository extends JpaRepository<Tarifa, Long> {
    boolean existsByTiempoAndTipoVehiculo(Integer tiempo, TipoVehiculo tipoVehiculo);

    List<Tarifa> findByEstatusOrderByTipoVehiculoNombreAscTiempoAsc(Boolean estatus);
}
