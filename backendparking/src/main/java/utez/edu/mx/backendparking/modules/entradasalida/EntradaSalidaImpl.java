package utez.edu.mx.backendparking.modules.entradasalida;

import org.springframework.stereotype.Service;

@Service
public class EntradaSalidaImpl {

    private final EntradaSalidaRepository entradaSalidaRepository;

    public EntradaSalidaImpl(EntradaSalidaRepository entradaSalidaRepository) {
        this.entradaSalidaRepository = entradaSalidaRepository;
    }


}
