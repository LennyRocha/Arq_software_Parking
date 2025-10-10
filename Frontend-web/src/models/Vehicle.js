import vehicleYup from "./yup/vehicleYup";
export default class Vehicle {
  constructor({ id, id_user, id_type, placa, modelo, desc, status }) {
    (this.id = id),
      (this.id_user = id_user),
      (this.id_type = id_type),
      (this.placa = placa),
      (this.modelo = modelo),
      (this.desc = desc),
      (this.status = status);
  }

  static getYup() {
    return vehicleYup;
  }

  get getId() {
    return this.id;
  }

  toJson() {
    return {
      id: this.id || null,
      id_usuario: this.id_user,
      id_tipo_vehiculo: this.id_type,
      placa: this.placa,
      modelo: this.modelo,
      descripcion: this.desc,
      estatus: this.status,
    };
  }

  toJSONString() {
    return JSON.stringify(this.toJson());
  }

  async validarCampos() {
    try {
      const validated = await Vehicle.getYup().validate(this, {
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
