import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private subjectDatosItinerario = new Subject<any>();
  private subjectDatosFilterItinerario = new Subject<any>();
  private subjectDatosBack = new Subject<any>();

  constructor() { }

  enviarDatosItinerario(codCiudadOrigen: number, codCiudadDestino: number, fechaIda: string, fechaRetorno: string){
    if(fechaRetorno == "VUELTA"){fechaRetorno="";}

    let datos = [{
      "codCiudadOrigen": codCiudadOrigen,
      "codCiudadDestino": codCiudadDestino,
      "fechaIda": fechaIda,
      "fechaRetorno": fechaRetorno
    }];
    
    this.subjectDatosItinerario.next(datos);
  }

  getDatosItinerario():Observable<any>{
    return this.subjectDatosItinerario.asObservable();
  }

  enviarDatosFilterItinerario(idFilter: number){
    let datos = [{
      "idFilter": idFilter
    }];
    this.subjectDatosFilterItinerario.next(datos);
  }

  getDatosFilterItinerario():Observable<any>{
    return this.subjectDatosFilterItinerario.asObservable();
  }

  enviarDatosBack(){
    this.subjectDatosBack.next('');
  }

  getDatosBack():Observable<any>{
    return this.subjectDatosBack.asObservable();
  }
}