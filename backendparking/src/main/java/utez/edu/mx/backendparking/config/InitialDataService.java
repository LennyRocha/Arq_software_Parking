package utez.edu.mx.backendparking.config;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.backendparking.modules.tarifa.domain.TarifaRepository;
import utez.edu.mx.backendparking.modules.tipovehiculo.domain.TipoVehiculo;
import utez.edu.mx.backendparking.modules.tipovehiculo.domain.TipoVehiculoRepository;

@Service
public class InitialDataService {

    private final TarifaRepository tarifaRepository;
    private final TipoVehiculoRepository tipoVehiculoRepository;

    public InitialDataService(TarifaRepository tarifaRepository, TipoVehiculoRepository tipoVehiculoRepository) {
        this.tarifaRepository = tarifaRepository;
        this.tipoVehiculoRepository = tipoVehiculoRepository;
    }

    @Transactional
    public void inicializarTiposDeVehiculo() {
        // Verificar si ya existen tipos de vehículo
        if (tipoVehiculoRepository.count() == 0) {
            // Crear los tres tipos de vehículo
            TipoVehiculo coche = new TipoVehiculo( "Coche");
            TipoVehiculo moto = new TipoVehiculo("Camioneta");
            TipoVehiculo camioneta = new TipoVehiculo("Moto");

            // Guardar en la base de datos
            tipoVehiculoRepository.save(coche);
            tipoVehiculoRepository.save(moto);
            tipoVehiculoRepository.save(camioneta);

            System.out.println("Tipos de vehículo inicializados correctamente");
        }
    }

    @Transactional
    public void inicializarTarifas() {}
}
