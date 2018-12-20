export class FiltroStandard{
  id: string;
  name:string;
  checked: boolean;
  constructor(id: any, nombre: string, checked: boolean) {
    this.id = id.toString();
    this.name = nombre;
    this.checked = checked;
  }
}
export class Plaza {
  id: string;
  nombre: string;
  properties: Properties;
  constructor(id: string, nombre:string, properties: Properties) {
    this.id = id;
    this.nombre = nombre;
    this.properties = properties;
  }
}
export class Properties{
  barrio: string;
  fecha_inicio: string;
  fecha_finalizacion_estimada: string;
  foto: Foto;
  tipo: string;

  constructor(barrio: string,fecha_inicio:string,fecha_finalizacion_estimada:string, foto:Foto, tipo:string) {
    this.barrio = barrio;
    this.foto =foto;
    this.fecha_inicio = fecha_inicio;
    this.fecha_finalizacion_estimada = fecha_finalizacion_estimada;
    this.tipo = tipo;
  }
}
export class Foto{
  original: string;
  thumbnail: string;
  constructor(original: string, thumbnail:string){
    this.original = original;
    this.thumbnail = thumbnail;
  }
}
