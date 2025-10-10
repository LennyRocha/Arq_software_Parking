export default class TipoVehiculo {
  constructor({ id, nombre }) {
    this.id = id;
    this.nombre = nombre;
  }

  get getId() {
    return this.id;
  }

  get getNombre() {
    return this.nombre;
  }

  toJson() {
    return {
      id: this.id || null,
      nombre: this.nombre,
    };
  }

  toJSONString() {
    return JSON.stringify(this.toJson());
  }
}
