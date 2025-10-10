export default class GlobalConfig {
  constructor({ id, type, data, fecha_creacion, fecha_actualizacion }) {
    this.id = id;
    this.tipo_configuracion = type;
    this.datos = data;
    this.fecha_creacion = fecha_creacion;
    this.fecha_actualizacion = fecha_actualizacion;
  }

  get getId() {
    return this.id;
  }

  toJson() {
    return {
      id: this.id || null,
      tipo_configuracion: this.tipo_configuracion,
      datos: this.datos,
      fecha_creacion: this.fecha_creacion,
      fecha_actualizacion: this.fecha_actualizacion,
    };
  }

  toJSONString() {
    return JSON.stringify(this.toJson());
  }
}
