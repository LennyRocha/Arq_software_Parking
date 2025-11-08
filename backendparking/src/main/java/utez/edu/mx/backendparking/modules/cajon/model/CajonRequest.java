package utez.edu.mx.backendparking.modules.cajon.model;

public class CajonRequest {
    private int idCar;
    private int piso;
    private Long idCajon;

    public CajonRequest(int idCar, int piso, Long idCajon) {
        this.idCar = idCar;
        this.piso = piso;
        this.idCajon = idCajon;
    }

    public CajonRequest(int idCar, int piso) {
        this.idCar = idCar;
        this.piso = piso;
    }

    public CajonRequest() {}

    public int getIdCar() {
        return idCar;
    }
    public void setIdCar(int idCar) {
        this.idCar = idCar;
    }
    public int getPiso() {
        return piso;
    }
    public void setPiso(int piso) {
        this.piso = piso;
    }
    public Long getIdCajon() { return idCajon; }
    public void setIdCajon(Long idCajon) { this.idCajon = idCajon; }
}
