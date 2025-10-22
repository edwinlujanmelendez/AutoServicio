import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Localidad } from '../interfaces/localidad';
import { Rutas } from '../interfaces/rutas';
import CryptoJS from 'crypto-js';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  url_api_ecommerce: string = "https://www.movilbus.pe/backendEcommerce/";                                         /* URL PRODUCTIVO - BACKEND ECOMMERCE */
  //url_api_ecommerce: string = "https://www.movilbus.pe/devbackEcoBus/";                                          /* URL DESARROLLO - BACKEND ECOMMERCE */
  //url_api_ecommerce: string = "http://localhost:8080/";                                                          /* URL LOCALHOST  - BACKEND ECOMMERCE */

  url_api_pinpad: string = "http://localhost:8080/";                                                          /* URL PRODUCTIVO - DESARROLLO */
  
  url_api_autoservicio: string = "https://www.movilbus.pe/backendAutoservicio/";                              /* URL PRODUCTIVO - BACKEND AUTOSERVICIO */
  //url_api_autoservicio: string = "https://www.movilbus.pe/backendAutoservicioQA/";                          /* URL DESARROLLO - BACKEND AUTOSERVICIO */
  //url_api_autoservicio: string = "http://localhost:8080/";                                                  /* DESARROLLO - BACKEND AUTOSERVICIO */

  //authEcommerce: string = btoa(`movilbus2025:2025M0v1l+`);      /* PRODUCTIVO */
  //authEcommerce: string = btoa(`movilbus:Mov1l2025$`);      /* DESARROLLO */

  constructor(private http: HttpClient, private authService: AuthService) { }

  // TODO: ************************************ PINPAD ************************************ //
  postGenerarPago(monto: string) {
    const body = {
      amount: monto,
      installments: "00"
    };
    return this.http.post<any>(`${this.url_api_pinpad}pcl/sale`, body);
  }

  getInit(){
    return this.http.get<any[]>(this.url_api_pinpad+"pcl/init");
  }

  getEcho(){
    return this.http.get<any[]>(this.url_api_pinpad+"pcl/echo");
  }

  getVoid(data: any){
    return this.http.post<any[]>(this.url_api_pinpad+"pcl/void", data);
  }

  getCierre(){
    return this.http.post<any[]>(this.url_api_pinpad+"pcl/batch", {});
  }
  // TODO: ************************************ PINPAD ************************************ //

  // TODO: ************************************ AUTOSERVICIO ************************************ //
  postGenerarVentaSispas(ArrayVentaSispas: any){
    return this.http.post(this.url_api_autoservicio+"Home/generarVentaSispas", ArrayVentaSispas, { responseType: 'text' });
  }

  getConsumirServicio(){
    return this.http.get(this.url_api_autoservicio+"Home/consumirServicio", { responseType: 'text' });
  }

  getUsuariosSispas(idAgencia: number){
    return this.http.get<any[]>(this.url_api_autoservicio+"Home/getUsuariosSispas/"+idAgencia);
  }

  validarUsuarioSispas(usuario: string, password: string){
    return this.http.get(this.url_api_autoservicio+"Home/validarUsuarioSispas/"+usuario+"/"+password, { responseType: 'text' });
  }

  getIdUsuarioSispas(usuario: string){
    return this.http.get(this.url_api_autoservicio+"Home/getIdUsuarioSispas/"+usuario, { responseType: 'text' });
  }

  getVerificarCajaAbierta(idUsuario: number, idAgencia: number){
    return this.http.get(this.url_api_autoservicio+"Home/getVerificarCajaAbierta/"+idUsuario+"/"+idAgencia, {});
  }

  getPromocionesSispas(itinerarioIda: number, rutaIda: number, fechaRutaIda: string, itinerarioVuelta: number, rutaVuelta: number, fechaRutaVuelta: string){
    return this.http.get<any[]>(this.url_api_autoservicio+"Home/getPromocionesSispas/"+itinerarioIda+"/"+rutaIda+"/"+fechaRutaIda+"/"+itinerarioVuelta+"/"+rutaVuelta+"/"+fechaRutaVuelta);
  }

  getReimprimirBoleto(nroDocumento: string){
    return this.http.get<any[]>(this.url_api_autoservicio+"Home/getReimprimirBoleto/"+nroDocumento);
  }

  getDescargarPdf(venpas_id: number){
    return this.http.get(this.url_api_autoservicio+"Home/getDescargarPdf/"+venpas_id, { responseType: 'text' });
  }

  enviarPdfCorreo(datos: any){
    return this.http.post(this.url_api_autoservicio+"Home/enviarPdfCorreo", datos, { responseType: 'text' });
  }
  // TODO: ************************************ AUTOSERVICIO ************************************ //

  // TODO: ************************************ ECOMMERCE ************************************ //
  getLocalidad(): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<any[]>(this.url_api_ecommerce + "Maestro/localidad", { headers });
      })
    );
  }

  getLocalidadDestino(idOrigen: number): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<Localidad[]>(this.url_api_ecommerce+"Maestro/localidad/destino/"+idOrigen, { headers });
      })
    );
  }

  getRutas(): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<any[]>(this.url_api_ecommerce + "Maestro/rutas", { headers });
      })
    );
  }

  getItinerario(idOrigen: number, idDestino: number, fechaIda: String, fechaVuelta: string, ida_vuelta_iguales: number, minutos_busqueda: number): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        if(fechaVuelta!=""){
          return this.http.get<any[]>(this.url_api_ecommerce+"Itinerario/disponibles/"+idOrigen+"/"+idDestino+"/"+fechaIda+"/"+fechaVuelta+"/"+ida_vuelta_iguales+"/"+minutos_busqueda, {headers});
        }else{
          return this.http.get<any[]>(this.url_api_ecommerce+"Itinerario/disponibles/"+idOrigen+"/"+idDestino+"/"+fechaIda+"/"+ida_vuelta_iguales+"/"+minutos_busqueda, {headers});
        }
      })
    );
  }

  getEstructuraBus(idItinerario: number, idRuta: number): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<any[]>(this.url_api_ecommerce+"Asiento/estructura/"+idItinerario+"/"+idRuta, {headers});
      })
    );
  }

  getTipoDocumento(): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<any[]>(this.url_api_ecommerce+"Maestro/tipodocumento", {headers});
      })
    );
  }

  getParametrosAsientos(): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<any[]>(this.url_api_ecommerce+"Maestro/parametro", {headers});
      })
    );
  }

  getTerminosCondiciones(): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<any[]>(this.url_api_ecommerce+"Maestro/terminoscondiciones", {headers});
      })
    );
  }

  postBloquearAsiento(
    rutaId: number,
    itinerarioId: number,
    fechaPartida: string,
    asiento: any,
    horaPartida: string,
    piso: any,
    tiempoBloqueo: number,
    tarifa: number,
    ipLocal: string
  ): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        const body = {
          rutaId,
          itinerarioId,
          fechaPartida,
          asiento,
          horaPartida,
          piso,
          tiempoBloqueo,
          tarifa,
          ipLocal
        };

        return this.http.post<any[]>(this.url_api_ecommerce + "Asiento/bloquear", body, { headers });
      })
    );
  }

  postActualizarBloqueoAsiento(
    rutaId: number,
    itinerarioId: number,
    fechaPartida: string,
    asiento: any,
    horaPartida: string,
    piso: any,
    tiempoBloqueo: number,
    tarifa: number,
    ipLocal: string
  ): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        const body = {
          rutaId,
          itinerarioId,
          fechaPartida,
          asiento,
          horaPartida,
          piso,
          tiempoBloqueo,
          tarifa,
          ipLocal
        };

        return this.http.put<any[]>(this.url_api_ecommerce + "Asiento/actualizar", body, { headers });
      })
    );
  }

  deleteLiberarAsiento(
    rutaId: number,
    itinerarioId: number,
    fechaPartida: string,
    asiento: any,
    horaPartida: string,
    piso: any,
    tiempoBloqueo: number,
    tarifa: number,
    ipLocal: string
  ): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        const body = {
          rutaId,
          itinerarioId,
          fechaPartida,
          asiento,
          horaPartida,
          piso,
          tiempoBloqueo,
          tarifa,
          ipLocal
        };

        return this.http.delete<any[]>(this.url_api_ecommerce + "Asiento/liberar", { headers, body });
      })
    );
  }

  getNameDocumento(tipo_doc: number, num_documento: string): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<any[]>(this.url_api_ecommerce+"Ventas/pasajero/"+tipo_doc+"/"+num_documento, {headers});
      })
    );
  }

  getDatosRuc(ruc: number): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<any[]>(this.url_api_ecommerce+"Ventas/cliente/"+ruc, {headers});
      })
    );
  }

  getMyIp(){
    return this.http.get<any[]>("https://api.ipify.org/?format=json");
  }
  // TODO: ************************************ ECOMMERCE ************************************ //
}