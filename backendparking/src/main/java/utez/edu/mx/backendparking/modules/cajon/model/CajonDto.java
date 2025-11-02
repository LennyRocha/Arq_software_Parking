package utez.edu.mx.backendparking.modules.cajon.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import utez.edu.mx.backendparking.modules.cajon.validation.UniqueIdentifier;
import utez.edu.mx.backendparking.modules.tipovehiculo.model.TipoVehiculo;

@UniqueIdentifier(nameField = "name", idField = "id")
public class CajonDto {

    private Long id;

    @NotBlank(message = "El campo identificador no puede estar vacío")
    @Size(max = 5,message = "El identificador del cajón solo alcanzará 5 caracteres")
    @Pattern(regexp = "^[A-Za-z0-9]+$", message = "¡No se permiten caracteres especiales!. Incluye solamente letras y números. Por ejemplo ‘A1’.")
    private String name;

    @NotNull(message = "Es obligatorio especificar el tipo de vehículo para este cajón")
    private TipoVehiculo tipoVehiculo;

    @NotBlank(message = "El campo ubicación no puede estar vacío")
    @Size(max = 100, message = "La ubicación es demasiado larga")
    private String ubicacion;

    @NotNull(message = "Se debe especificar la disponibilidad actual de este cajón")
    private Boolean disponible = Boolean.TRUE;

    @NotNull(message = "Se debe especificar si este cajón es exclusivo para pensionados")
    private Boolean paraPensionados = Boolean.FALSE;

    @NotNull(message = "El campo piso no puede estar vacío")
    private int piso;

    private boolean estatus = true;

    public Cajon toEntity(){
        Cajon cajon = new Cajon();
        if(id != null) cajon.setId(id);
        cajon.setName(name);
        cajon.setTipoVehiculo(tipoVehiculo);
        cajon.setUbicacion(ubicacion);
        cajon.setDisponible(disponible);
        cajon.setParaPensionados(paraPensionados);
        cajon.setPiso(piso);
        cajon.setEstatus(estatus);
        return cajon;
    }

    public static CajonDto fromEntity(Cajon cajon){
        if(cajon == null) return null;
        CajonDto cajonDto = new CajonDto();
        cajonDto.id = cajon.getId();
        cajonDto.name = cajon.getName();
        cajonDto.tipoVehiculo = cajon.getTipoVehiculo();
        cajonDto.ubicacion = cajon.getUbicacion();
        cajonDto.disponible = cajon.getDisponible();
        cajonDto.paraPensionados = cajon.getParaPensionados();
        cajonDto.piso = cajon.getPiso();
        cajonDto.estatus = cajon.getEstatus();
        return cajonDto;
    }

    public Boolean getDisponible() {
        return disponible;
    }

    public void setDisponible(Boolean disponible) {
        this.disponible = disponible;
    }

    public boolean isEstatus() {
        return estatus;
    }

    public void setEstatus(boolean estatus) {
        this.estatus = estatus;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getParaPensionados() {
        return paraPensionados;
    }

    public void setParaPensionados(Boolean paraPensionados) {
        this.paraPensionados = paraPensionados;
    }

    public int getPiso() {
        return piso;
    }

    public void setPiso(int piso) {
        this.piso = piso;
    }

    public TipoVehiculo getTipoVehiculo() {
        return tipoVehiculo;
    }

    public void setTipoVehiculo(TipoVehiculo tipoVehiculo) {
        this.tipoVehiculo = tipoVehiculo;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }
}
