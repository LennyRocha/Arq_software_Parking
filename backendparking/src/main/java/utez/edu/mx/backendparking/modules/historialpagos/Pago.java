package utez.edu.mx.backendparking.modules.historialpagos;

import jakarta.persistence.*;
import utez.edu.mx.backendparking.modules.usuariopension.UsuarioPension;

import java.time.LocalDate;

// ESTA ES LA TABLA DE HISTORIAL DE PAGOS REALIZADOS
@Entity
@Table(name = "pago")
public class Pago {

    // ATRIBUTOS
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name= "cantidad_pago", nullable = false)
    private Double cantidadPago;

    @Column(name= "fecha_pago", nullable = false)
    private LocalDate fechaPago;

    @Column(name= "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name= "fecha_fin", nullable = false)
    private LocalDate fechaFin;

    // CAMPOS PROVENIENTES DE MERCADO PAGO
    @Column(name = "id_pago_mercado_pago")
    private String idPagoMercadoPago; // ID único del pago en Mercado Pago

    @Column(name = "estado_pago_mercado_pago")
    private String estadoPagoMercadoPago; // "approved", "rejected", etc.

    @Column(name = "metodo_pago")
    private String metodoPago; // "credit_card", "debit_card", etc.

    @Column(name = "referencia_mercadopago")
    private String referenciaMercadopago; // Referencia o ID de la transacción


    // ATRIBUTOS DE RELACION
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_usuario_pension", referencedColumnName = "id")
    private UsuarioPension usuarioPension;


    // GETTERS Y SETTERS
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getCantidadPago() {
        return cantidadPago;
    }

    public void setCantidadPago(Double cantidadPago) {
        this.cantidadPago = cantidadPago;
    }

    public LocalDate getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(LocalDate fechaPago) {
        this.fechaPago = fechaPago;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public UsuarioPension getUsuarioPension() {
        return usuarioPension;
    }

    public void setUsuarioPension(UsuarioPension usuarioPension) {
        this.usuarioPension = usuarioPension;
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
