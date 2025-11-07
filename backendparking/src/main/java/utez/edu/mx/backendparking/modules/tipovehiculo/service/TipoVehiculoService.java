package utez.edu.mx.backendparking.modules.tipovehiculo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.backendparking.modules.tipovehiculo.model.TipoVehiculo;
import utez.edu.mx.backendparking.modules.tipovehiculo.repository.TipoVehiculoRepository;
import utez.edu.mx.backendparking.shared.exception.ResourceNotFoundException;

import java.util.List;
import java.util.Optional;

@Service
public class TipoVehiculoService {
    @Autowired
    private TipoVehiculoRepository tipoVehiculoRepository;

    @Transactional(readOnly = true)
    public List<TipoVehiculo> findAll() {
        return tipoVehiculoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public TipoVehiculo findById(Integer id) {
        Optional<TipoVehiculo> tipoVehiculo = tipoVehiculoRepository.findById(id);
        return tipoVehiculo.orElseThrow(() -> new ResourceNotFoundException("Tipo de vehiculo incorrecto"));
    }

    @Transactional
    public TipoVehiculo save(TipoVehiculo tipoVehiculo) {
        return tipoVehiculoRepository.save(tipoVehiculo);
    }

    @Transactional
    public TipoVehiculo update(Integer id, TipoVehiculo tipoVehiculo) {
        Optional<TipoVehiculo> tVehi = tipoVehiculoRepository.findById(id);
        if (tVehi.isPresent()) {
            tipoVehiculo.setNombre(tipoVehiculo.getNombre());
            return tipoVehiculoRepository.save(tipoVehiculo);
        } else {
            throw new ResourceNotFoundException("Tipo de vehiculo incorrecto");
        }
    }
}
