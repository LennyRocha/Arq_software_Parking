import cajonYup from './yup/cajonYup'
export default class Cajon {
  constructor({ id, identif, ubicacion, ocupado, para_pensionado, estatus, piso }) {
    this.id = id;
    this.identificador = identif;
    this.ubicacion = ubicacion;
    this.ocupado = ocupado;
    this.para_pensionado = para_pensionado;
    this.estatus = estatus;
    this.piso = piso
  }

  static getYup() {
    return cajonYup;
  }

  get getId() {
    return this.id;
  }

  toJson() {
    return {
      id: this.id || null,
      identificador_cajon: this.identificador,
      desripcion_ubicacion: this.ubicacion,
      ocupado: this.ocupado,
      para_pensionado: this.para_pensionado,
      numero_piso: this.piso,
      estatus: this.estatus,
    };
  }

  toJSONString() {
    return JSON.stringify(this.toJson());
  }

  async validarCampos() {
    try {
      const validated = await Cajon.getYup().validate(this, {
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
