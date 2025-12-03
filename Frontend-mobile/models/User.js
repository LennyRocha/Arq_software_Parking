import userYup from "./yup/userYup";
export default class User {
  constructor({
    id,
    nombre,
    apellidos,
    correo,
    telefono,
  }) {
    this.id = id;
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.correo = correo;
    this.telefono = telefono;
  }

  static getYup() {
    return userYup;
  }

  get getId() {
    return this.id;
  }

  get getRole() {
    return this.rol;
  }

  toJson() {
    return {
      id: this.id || null,
      nombre: this.nombre,
      apellidos: this.apellidos,
      correo: this.correo,
      telefono: this.telefono,
    };
  }

  toJSONString() {
    return JSON.stringify(this.toJson());
  }

  async validarCampos() {
    try {
      const validated = await User.getYup().validate(this, {
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
