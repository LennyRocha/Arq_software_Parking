package utez.edu.mx.backendparking.modules.entradasalida;

public class EntradaSalidaSocket {
    private Long id;
    private String accion;

    public EntradaSalidaSocket(Long id, String accion) {
        this.id = id;
        this.accion = accion;
    }

    public String getAccion() {
        return accion;
    }

    public void setAccion(String accion) {
        this.accion = accion;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
