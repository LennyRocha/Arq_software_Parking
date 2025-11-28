export default class TipoVehiculo {
  constructor({ id, nombre }) {
    this._id = id;
    this._nombre = nombre;
  }

  get getId() {
    return this._id;
  }

  get getNombre() {
    return this._nombre;
  }

  toJson() {
    return {
      id: this._id || null,
      nombre: this._nombre,
    };
  }

  toJSONString() {
    return JSON.stringify(this.toJson());
  }
}
