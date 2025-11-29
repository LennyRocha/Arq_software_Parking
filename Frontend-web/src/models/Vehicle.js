import vehicleYup from "./yup/vehicleYup";
export default class Vehicle {
  constructor({ id, id_user, id_type, placa, modelo, desc, status, type_object }) {
    this._id = id;
    this._id_user = id_user;
    this._id_type = id_type;
    this._placa = placa;
    this._modelo = modelo;
    this._desc = desc;
    this._status = status;
    this._type_object = type_object;
  }

  static getYup() {
    return vehicleYup;
  }

  get getId() {
    return this.id;
  }

  toJson() {
    return {
      id: this._id || null,
      idUsuario: this._id_user,
      idTipoVehiculo: this._id_type,
      placa: this._placa,
      modelo: this._modelo,
      descripcion: this._desc,
      estatus: this._status,
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