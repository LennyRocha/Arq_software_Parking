import pensionYup from "./yup/pensionYup";
export default class Pension {
  constructor({ id, duracionDias, estatus, costo, nombre }) {
    this._id = id;
    this._duracionDias = duracionDias;
    this._estatus = estatus;
    this._costo = costo;
    this._nombre = nombre;
  }

  static getYup() {
    return pensionYup;
  }

  get getId() {
    return this._id;
  }

  toJson() {
    return {
      id: this._id || null,
      duracionDias: this._duracionDias,
      costo: this._costo,
      nombre: this._nombre,
      estatus: this._estatus,
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
