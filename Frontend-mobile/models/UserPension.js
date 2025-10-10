import usuario_pensionYup from "./yup/usuario_pensionYup";
export default class UserPension {
  constructor({
    id,
    id_usuario,
    id_pension,
    fecha_end,
    id_entrada,
    qr_uuid,
    estatus,
  }) {
    this.id = id;
    this.id_usuario = id_usuario;
    this.id_pension = id_pension;
    this.fecha_finalizacion = fecha_end;
    this.uuid_codigo_qr = qr_uuid;
    this.id_ultima_entrada = id_entrada;
    this.estatus = estatus;
  }

  static getYup() {
    return usuario_pensionYup;
  }

  get getId() {
    return this.id;
  }

  toJson() {
    return {
      id: this.id || null,
      id_usuario: this.id_usuario,
      id_pension: this.id_pension,
      fecha_finalizacion: this.fecha_finalizacion,
      uuid_codigo_qr: this.uuid_codigo_qr,
      id_ultima_entrada: this.id_ultima_entrada,
      estatus: this.estatus,
    };
  }

  toJSONString() {
    return JSON.stringify(this.toJson());
  }

  async validarCampos() {
    try {
      const validated = await UserPension.getYup().validate(this, {
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
