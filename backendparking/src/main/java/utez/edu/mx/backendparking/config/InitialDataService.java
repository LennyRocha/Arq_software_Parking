package utez.edu.mx.backendparking.config;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.backendparking.modules.pension.Pension;
import utez.edu.mx.backendparking.modules.pension.PensionRepository;
import utez.edu.mx.backendparking.modules.tarifa.Tarifa;
import utez.edu.mx.backendparking.modules.tarifa.TarifaRepository;
import utez.edu.mx.backendparking.modules.tipovehiculo.model.TipoVehiculo;
import utez.edu.mx.backendparking.modules.tipovehiculo.repository.TipoVehiculoRepository;

import java.util.List;

@Service
public class InitialDataService {

    private final TarifaRepository tarifaRepository;
    private final TipoVehiculoRepository tipoVehiculoRepository;
    private final PensionRepository pensionRepository;

    public InitialDataService(TarifaRepository tarifaRepository, TipoVehiculoRepository tipoVehiculoRepository, PensionRepository pensionRepository) {
        this.tarifaRepository = tarifaRepository;
        this.tipoVehiculoRepository = tipoVehiculoRepository;
        this.pensionRepository = pensionRepository;
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

    @Transactional
    public void inicializarPensiones() {
        if (pensionRepository.count() == 0) {
            // Pensiones para Coche
            Pension carBasic = new Pension();
            carBasic.setNombre("Coche-Basica");
            carBasic.setDuracionDias(7);
            carBasic.setCosto(500.0);
            carBasic.setStatus(true);

            Pension carClassic = new Pension();
            carClassic.setNombre("Coche-Clasica");
            carClassic.setDuracionDias(15);
            carClassic.setCosto(800.0);
            carClassic.setStatus(true);

            Pension carPremium = new Pension();
            carPremium.setNombre("Coche-Premium");
            carPremium.setDuracionDias(30);
            carPremium.setCosto(1500.0);
            carPremium.setStatus(true);

            // Pensiones para Moto
            Pension motoBasic = new Pension();
            motoBasic.setNombre("Moto-Basica");
            motoBasic.setDuracionDias(7);
            motoBasic.setCosto(300.0);
            motoBasic.setStatus(true);

            Pension motoClassic = new Pension();
            motoClassic.setNombre("Moto-Clasica");
            motoClassic.setDuracionDias(15);
            motoClassic.setCosto(500.0);
            motoClassic.setStatus(true);

            Pension motoPremium = new Pension();
            motoPremium.setNombre("Moto-Premium");
            motoPremium.setDuracionDias(30);
            motoPremium.setCosto(650.0);
            motoPremium.setStatus(true);

            // Pensiones para Camioneta
            Pension camionetaBasic = new Pension();
            camionetaBasic.setNombre("Camioneta-Basica");
            camionetaBasic.setDuracionDias(7);
            camionetaBasic.setCosto(600.0);
            camionetaBasic.setStatus(true);

            Pension camionetaClassic = new Pension();
            camionetaClassic.setNombre("Camioneta-Clasica");
            camionetaClassic.setDuracionDias(15);
            camionetaClassic.setCosto(800.0);
            camionetaClassic.setStatus(true);

            Pension camionetaPremium = new Pension();
            camionetaPremium.setNombre("Camioneta-Premium");
            camionetaPremium.setDuracionDias(30);
            camionetaPremium.setCosto(1000.0);
            camionetaPremium.setStatus(true);

            // Guardar todos
            pensionRepository.save(carBasic);
            pensionRepository.save(carClassic);
            pensionRepository.save(carPremium);
            pensionRepository.save(motoBasic);
            pensionRepository.save(motoClassic);
            pensionRepository.save(motoPremium);
            pensionRepository.save(camionetaBasic);
            pensionRepository.save(camionetaClassic);
            pensionRepository.save(camionetaPremium);
        }
    }
}
