import pensionYup from "./yup/pensionYup";
export default class Pension {
  constructor({ id, duracion, estatus, costo, nombre }) {
    this.id = id;
    this.duracion = duracion;
    this.estatus = estatus;
    this.costo = costo;
    this.nombre = nombre;
  }

  static getYup() {
    return pensionYup;
  }

  get getId() {
    return this.id;
  }

  toJson() {
    return {
      id: this.id || null,
      duracion: this.duracion,
      costo: this.costo,
      nombre: this.nombre,
      estatus: this.estatus,
    };
  }

  toJSONString() {
    return JSON.stringify(this.toJson());
  }

  async validarCampos() {
    try {
      const validated = await Pension.getYup().validate(this, {
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
