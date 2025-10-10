import tarifaYup from "./yup/tarifaYup";
export default class Tarifa {
  constructor({ id, tiempo, id_vehiculo, costo, estatus }) {
    this.id = id;
    this.tiempo = tiempo;
    this.id_vehiculo = id_vehiculo;
    this.costo = costo;
    this.estatus = estatus;
  }

  static getYup() {
    return tarifaYup;
  }

  get getId() {
    return this.id;
  }

  toJson() {
    return {
      id: this.id || null,
      tiempo: this.tiempo,
      id_tipo_vehiculo: this.id_vehiculo,
      costo: this.costo,
      estatus: this.estatus,
    };
  }

  toJSONString() {
    return JSON.stringify(this.toJson());
  }

  async validarCampos() {
    try {
      const validated = await Tarifa.getYup().validate(this, {
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
