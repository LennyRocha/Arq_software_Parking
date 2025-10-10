import roleYup from "./yup/roleYup";

export default class Role {
  constructor({ id, name }) {
    this.id = id;
    this.name = name;
  }

  static getYup() {
    return roleYup;
  }

  get getId() {
    return this.id;
  }

  toJson() {
    return {
      id: this.id,
      nombre: this.nombre,
    };
  }

  toJSONString() {
    return JSON.stringify(this.toJson());
  }

  async validarCampos() {
    try {
      const validated = await Role.getYup().validate(this, {
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
