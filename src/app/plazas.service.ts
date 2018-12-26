import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class PlazasService {

  constructor(private http:HttpClient) { }

  getPlazas(page){
    return this.http.get('https://gobiernoabierto.cordoba.gob.ar/api/v2/espacios-verdes/espacios-verdes/?page='+page+'&page_size=40');
  }
  getEspaciosVerdes(page){
    return this.http.get('https://gobiernoabierto.cordoba.gob.ar/api/v2/espacios-verdes/frentes-espacios-verdes/?page='+page+'&page_size=10');
  }
  getTotalPlazas(){
    return this.http.get('https://gobiernoabierto.cordoba.gob.ar/api/v2/arboles/contador-arboles');
  }

  getBarrios(){
    return this.http.get('https://gobiernoabierto.cordoba.gob.ar/api/v2/barrios/barrios/?page_size=470');
  }

  getFilterArboles(barrio?: number[]) {
    return this.http.get('https://gobiernoabierto.cordoba.gob.ar/api/v2/espacios-verdes/espacios-verdes/?barrios_ids='+barrio);
  }
}
