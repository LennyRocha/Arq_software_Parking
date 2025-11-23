package utez.edu.mx.backendparking.modules.usuariopension.dto;

import jakarta.validation.constraints.*;


import java.util.List;

public class PensionadoRegistrationDto {

    @NotNull(message = "El ID de la pensión es requerido")
    private Long pensionId;

    @NotBlank(message = "El campo nombre no puede estar vacío")
    @Size(max = 50, message = "El nombre debe no exceder 50 caracteres")
    private String nombre;

    @NotBlank(message = "El campo apellido no puede estar vacío")
    @Size(max = 50, message = "El apellido debe no exceder 50 caracteres")
    private String apellidos;

    @NotBlank(message = "El campo correo no puede estar vacío")
    @Size(max = 50, message = "El correo debe no exceder 50 caracteres")
    @Email(message = "El formato del correo no es válido")
    private String correo;

    @NotBlank(message = "El campo teléfono no puede estar vacío")
    @Size(min = 10, max = 10, message = "El teléfono debe tener exactamente 10 dígitos")
    private String telefono;

    @NotBlank(message = "El campo contraseña no puede estar vacío")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String contra;

    @NotEmpty(message = "Debe registrar al menos un vehículo")
    private List<VehiculoDto> vehiculos;

    // Campos de Mercado Pago - OPCIONALES
    private String idPagoMercadoPago;
    private String estadoPagoMercadoPago;
    private String metodoPago;
    private String referenciaMercadopago;

    public Long getPensionId() {
        return pensionId;
    }

    public void setPensionId(Long pensionId) {
        this.pensionId = pensionId;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getContra() {
        return contra;
    }

    public void setContra(String contra) {
        this.contra = contra;
    }

    public List<VehiculoDto> getVehiculos() {
        return vehiculos;
    }

    public void setVehiculos(List<VehiculoDto> vehiculos) {
        this.vehiculos = vehiculos;
    }

    public String getIdPagoMercadoPago() {
        return idPagoMercadoPago;
    }

    public void setIdPagoMercadoPago(String idPagoMercadoPago) {
        this.idPagoMercadoPago = idPagoMercadoPago;
    }

    public String getEstadoPagoMercadoPago() {
        return estadoPagoMercadoPago;
    }

    public void setEstadoPagoMercadoPago(String estadoPagoMercadoPago) {
        this.estadoPagoMercadoPago = estadoPagoMercadoPago;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public String getReferenciaMercadopago() {
        return referenciaMercadopago;
    }

    public void setReferenciaMercadopago(String referenciaMercadopago) {
        this.referenciaMercadopago = referenciaMercadopago;
    }
}
