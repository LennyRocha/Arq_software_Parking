package utez.edu.mx.backendparking.modules.vehiculo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;
import utez.edu.mx.backendparking.modules.vehiculo.model.Vehiculo;

@Repository
public interface VehiculoRepository extends JpaRepository<Vehiculo, Long>{

    boolean existsByPlacaAndIdNot(String placa, Long id);

    // Método para buscar todos los vehículos de un usuario
    List<Vehiculo> findByUsuarioId(Long usuarioId);

}
