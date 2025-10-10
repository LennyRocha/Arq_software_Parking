import entrada_salidaYup from "./yup/entrada_salidaYup";
export default class EntSal {
  constructor({
    id,
    id_usuario,
    id_vehiculo,
    folio,
    id_type,
    h_entrada,
    h_salida,
    pago,
    fecha,
  }) {
    this.id = id;
    this.id_usuario = id_usuario;
    this.id_vehiculo = id_vehiculo;
    this.folio_ticket = folio;
    this.id_tipo_vehiculo = id_type;
    this.hora_entrada = h_entrada;
    this.hora_salida = h_salida;
    this.cantidad_pago = pago;
    this.fecha = fecha;
  }

  static getYup() {
    return entrada_salidaYup;
  }

  get getId() {
    return this.id;
  }

  toJson() {
    return {
      id: this.id || null,
      id_usuario: this.id_usuario,
      id_vehiculo: this.id_vehiculo,
      folio_ticket: this.folio_ticket,
      id_tipo_vehiculo: this.id_tipo_vehiculo,
      hora_entrada: this.hora_entrada,
      hora_salida: this.hora_salida,
      cantidad_pago: this.cantidad_pago,
      fecha: this.fecha,
    };
  }

  toJSONString() {
    return JSON.stringify(this.toJson());
  }

  async validarCampos() {
    try {
      const validated = await EntSal.getYup().validate(this, {
        abortEarly: false,
      });
      return { valid: true, data: validated, errors: null };
    } catch (error) {
      const fieldErrors = {};

      // Si hay múltiples errores, recorremos error.inner
      if (error.inner && error.inner.length > 0) {
        error.inner.forEach((err) => {
          fieldErrors[err.path] = err.message;
        });
      } else if (error.path) {
        // Si es un solo error, asignamos directamente
        fieldErrors[error.path] = error.message;
      }

      return { valid: false, data: null, errors: fieldErrors };
    }
  }
}
