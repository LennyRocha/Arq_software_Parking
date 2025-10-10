import userYup from "./yup/userYup";
export default class User {
  constructor({
    id,
    nombre,
    apellido_p,
    apellido_m,
    correo,
    telefono,
    contra,
    rol,
    estatus,
    pensionado,
  }) {
    this.id = id;
    this.nombre = nombre;
    this.apellido_p = apellido_p;
    this.apellido_m = apellido_m;
    this.correo = correo;
    this.telefono = telefono;
    this.contra = contra;
    this.rol = rol;
    this.estatus = estatus;
    this.pensionado = pensionado;
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
      apellido_paterno: this.apellido_p,
      apellido_materno: this.apellido_m,
      correo: this.correo,
      telefono: this.telefono,
      id_rol: this.rol?.toJson() || null,
      estatus: this.estatus,
      es_pensionado: this.pensionado,
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
