package utez.edu.mx.backendparking.config;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.backendparking.modules.tarifa.Tarifa;
import utez.edu.mx.backendparking.modules.tarifa.TarifaRepository;
import utez.edu.mx.backendparking.modules.tipovehiculo.TipoVehiculo;
import utez.edu.mx.backendparking.modules.tipovehiculo.TipoVehiculoRepository;

import java.util.List;

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
    public void inicializarTarifas() {
        // Verificar si ya existen tarifas
        if (tarifaRepository.count() == 0) {
            // Obtener los tipos de vehículo
            List<TipoVehiculo> tiposVehiculo = tipoVehiculoRepository.findAll();

            if (tiposVehiculo.isEmpty()) {
                System.out.println("No hay tipos de vehículo. Inicialice primero los tipos de vehículo.");
                return;
            }

            // Crear tarifas para cada tipo de vehículo
            for (TipoVehiculo tipo : tiposVehiculo) {
                // Tarifa por hora (60 minutos)
                Tarifa tarifa1Hora = new Tarifa();
                tarifa1Hora.setTiempo(60);
                tarifa1Hora.setEstatus(true);
                tarifa1Hora.setTipoVehiculo(tipo);

                // Tarifa por 3 horas (180 minutos)
                Tarifa tarifa3Horas = new Tarifa();
                tarifa3Horas.setTiempo(180);
                tarifa3Horas.setEstatus(true);
                tarifa3Horas.setTipoVehiculo(tipo);

                // Tarifa por día (1440 minutos = 24 horas)
                Tarifa tarifaDia = new Tarifa();
                tarifaDia.setTiempo(1440);
                tarifaDia.setEstatus(true);
                tarifaDia.setTipoVehiculo(tipo);

                // Establecer costos según el tipo de vehículo
                if (tipo.getNombre().equalsIgnoreCase("Coche")) {
                    tarifa1Hora.setCosto(20.0);
                    tarifa3Horas.setCosto(50.0);
                    tarifaDia.setCosto(150.0);
                } else if (tipo.getNombre().equalsIgnoreCase("Moto")) {
                    tarifa1Hora.setCosto(10.0);
                    tarifa3Horas.setCosto(25.0);
                    tarifaDia.setCosto(80.0);
                } else if (tipo.getNombre().equalsIgnoreCase("Camioneta")) {
                    tarifa1Hora.setCosto(30.0);
                    tarifa3Horas.setCosto(75.0);
                    tarifaDia.setCosto(200.0);
                } else {
                    // Tarifas por defecto para otros tipos
                    tarifa1Hora.setCosto(15.0);
                    tarifa3Horas.setCosto(40.0);
                    tarifaDia.setCosto(120.0);
                }

                // Guardar las tarifas
                tarifaRepository.save(tarifa1Hora);
                tarifaRepository.save(tarifa3Horas);
                tarifaRepository.save(tarifaDia);
            }

            System.out.println("Tarifas inicializadas correctamente");
        }
    }
}
