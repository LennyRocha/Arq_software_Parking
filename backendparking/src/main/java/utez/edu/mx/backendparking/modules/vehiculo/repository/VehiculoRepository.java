package utez.edu.mx.backendparking.modules.vehiculo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;
import utez.edu.mx.backendparking.modules.vehiculo.model.Vehiculo;

@Repository
public interface VehiculoRepository extends JpaRepository<Vehiculo, Long>{

    boolean existsByPlacaAndIdNot(String placa, Long id);

}
