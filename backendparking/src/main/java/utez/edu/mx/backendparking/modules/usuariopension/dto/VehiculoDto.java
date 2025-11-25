package utez.edu.mx.backendparking.modules.usuariopension.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class VehiculoDto {

    @NotNull(message = "El ID del tipo de vehículo es requerido")
    private Integer tipoVehiculoId;

    @NotBlank(message = "La placa no puede estar vacío")
    @Size(max = 7, message = "La placa no debe tener más de 7 caracteres")
    @Pattern(regexp = "^$|^[A-Za-z0-9-]+$", message = "La placa solo puede contener letras, números y guiones")
    private String placa;

    @NotBlank(message = "El campo modelo no puede estar vacío")
    @Size(max = 50, message = "El modelo debe no exceder 50 caracteres")
    private String modelo;

    @NotBlank(message = "El campo descripcion no puede estar vacío")
    @Size(max = 50, message = "La descripcion debe no exceder 50 caracteres")
    private String descripcion;

    public Integer getTipoVehiculoId() {
        return tipoVehiculoId;
    }

    public void setTipoVehiculoId(Integer tipoVehiculoId) {
        this.tipoVehiculoId = tipoVehiculoId;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
