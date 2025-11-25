package utez.edu.mx.backendparking.modules.mercadopago.dto;

public class PreferenciaResponse {

    private String id;
    private String initPoint;
    private String sandboxInitPoint;

    public PreferenciaResponse() {
    }

    public PreferenciaResponse(String id, String initPoint, String sandboxInitPoint) {
        this.id = id;
        this.initPoint = initPoint;
        this.sandboxInitPoint = sandboxInitPoint;
    }

    // Getters y Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getInitPoint() {
        return initPoint;
    }

    public void setInitPoint(String initPoint) {
        this.initPoint = initPoint;
    }

    public String getSandboxInitPoint() {
        return sandboxInitPoint;
    }

    public void setSandboxInitPoint(String sandboxInitPoint) {
        this.sandboxInitPoint = sandboxInitPoint;
    }
}
