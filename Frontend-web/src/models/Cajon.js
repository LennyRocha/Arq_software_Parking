import cajonYup from './yup/cajonYup'
export default class Cajon {
  constructor({ id, name, tipoVehiculo, ubicacion, disponible, paraPensionados, estatus, piso }) {
    this.id = id;
    this.name = name;
    this.tipoVehiculo = tipoVehiculo;
    this.ubicacion = ubicacion;
    this.disponible = disponible;
    this.paraPensionados = paraPensionados;
    this.estatus = estatus;
    this.piso = piso;
  }

  static getYup() {
    return cajonYup;
  }

  toJson() {
    return {
      id: this.id ?? null,
      name: this.name,
      tipoVehiculo: {
        id: this.tipoVehiculo.id,
        nombre: this.tipoVehiculo.nombre
      },
      ubicacion: this.ubicacion,
      disponible: this.disponible,
      paraPensionados: this.paraPensionados,
      piso: this.piso,
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
