package utez.edu.mx.backendparking.modules.vehiculo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;
import utez.edu.mx.backendparking.modules.vehiculo.model.Vehiculo;

@Repository
public interface VehiculoRepository  extends JpaRepository<Vehiculo, Long>{

    //Todos los vehículos de un usuario
    List<Vehiculo> findAllByUsuario_Id(Long userId);
    //Todos los vehículos de un solo tipo
    List<Vehiculo> findAllByUsuario_IdAndTipoVehiculoId(Long usuario_id, Integer tipoVehiculo_id);
    //Buscar por nombre o por descripción
    List<Vehiculo> findAllByUsuario_IdAndModeloContainingIgnoreCaseOrUsuario_IdAndDescripcionContainingIgnoreCaseOrderByModelo(Long id1, String modelo, Long id2, String descripcion);
    //Si tienen placa o no, pero si están activos
    List<Vehiculo> findAllByUsuario_IdAndEstatusTrueAndPlacaIsNotNull(Long id);
    List<Vehiculo> findAllByUsuario_IdAndEstatusTrueAndPlacaIsNull(Long userId);
    //No importa el estado pero si tienen placa o no
    List<Vehiculo> findAllByUsuario_IdAndPlacaIsNull(Long userId);
    List<Vehiculo> findAllByUsuario_IdAndPlacaIsNotNull(Long userId);
    //Si tienen placa o no, pero si están activos y por tipo de vehículo
    List<Vehiculo> findAllByUsuario_IdAndEstatusTrueAndPlacaIsNotNullAndTipoVehiculoId(Long usuario_id, Integer tipoVehiculo_id);
    List<Vehiculo> findAllByUsuario_IdAndEstatusTrueAndPlacaIsNullAndTipoVehiculoId(Long usuario_id, Integer tipoVehiculo_id);
    //No importa el estado pero si tienen placa o no y por tipo de vehiculo
    List<Vehiculo> findAllByUsuario_IdAndPlacaIsNullAndTipoVehiculoId(Long usuario_id, Integer tipoVehiculo_id);
    List<Vehiculo> findAllByUsuario_IdAndPlacaIsNotNullAndTipoVehiculoId(Long usuario_id, Integer tipoVehiculo_id);



}
