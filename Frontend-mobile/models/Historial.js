import historialYup from "./yup/historialYup";
export default class Historial {
  constructor({
    id,
    id_usuario_pen,
    cantidad,
    fecha_pago,
    fecha_inicio,
    fecha_end,
  }) {
    this.id = id;
    this.id_usuario_pension = id_usuario_pen;
    this.cantidad = cantidad;
    this.fecha_fin = fecha_end;
    this.fecha_pago = fecha_pago;
    this.fecha_inicio = fecha_inicio;
  }

  static getYup() {
    return historialYup;
  }

  get getId() {
    return this.id;
  }

  toJson() {
    return {
      id: this.id || null,
      id_usuario_pension: this.id_usuario_pension,
      cantidad: this.cantidad,
      fecha_fin: this.fecha_fin,
      fecha_pago: this.fecha_pago,
      fecha_inicio: this.fecha_inicio,
    };
  }

  toJSONString() {
    return JSON.stringify(this.toJson());
  }

  async validarCampos() {
    try {
      const validated = await Historial.getYup().validate(this, {
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
