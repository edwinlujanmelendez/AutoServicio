import { Component, OnInit, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { SharedService } from '../shared.service';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { TaskService } from '../services/task.service';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import { DOCUMENT } from '@angular/common';
import { AppComponent } from '../app.component';

declare var $:any;

@Component({
  selector: 'app-datos-pasajeros',
  templateUrl: './datos-pasajeros.component.html',
  styleUrls: ['./datos-pasajeros.component.css']
})
export class DatosPasajerosComponent implements OnInit {

  fileUrl;

  date!: Date;
  date_hoy!: string;

  public innerWidth: any;
  public innerHeight: any;

  numeroPagina: number = 4;
  sub_titulo: string = "Llena tus datos";

  nombre_ciudad_origen: string = "";
  nombre_ciudad_destino: string = "";
  nombreFechaEmbarqueIda: string = "";
  nombreFechaEmbarqueVuelta: string = "";

  num_asientos: string = "";
  num_asientos_ida_p1: string = "";
  num_asientos_ida_p2: string = "";
  num_asientos_ida_historico: string = "";
  precio_ida_total: number = 0;
  num_asientos_vuelta_p1: string = "";
  num_asientos_vuelta_p2: string = "";
  num_asientos_vuelta_historico: string = "";
  precio_vuelta_total: number = 0;
  precio_total: number = 0;

  verif: number = 0;

  tipos_documentos: any;

  pasajero_asientos: Array<{asiento_ida: string, asiento_vuelta: string, precio_ida: any, precio_vuelta: any, piso_ida: number, piso_vuelta: number, porcentaje_descuento_ida: number, porcentaje_descuento_vuelta: number}> = [];
  pasajero_asientos_ida: Array<{asiento: string, precio: any, piso: number}> = [];
  pasajero_asientos_vuelta: Array<{asiento: string, precio: any, piso: number}> = [];
  
  num_asientos_ida: string = "";
  num_asientos_vuelta: string = "";
  precio_asientos_ida: Array<string> = [];
  precio_asientos_vuelta: Array<string> = [];
  list_pasajeros_asientos_ida: string = "";
  precio_pasajeros_asientos_ida: number = 0;
  precio_total_pasajeros_asientos: number = 0;
  cant_pasajeros_asientos_ida: number = 0;
  list_pasajeros_asientos_vuelta: string = "";
  precio_pasajeros_asientos_vuelta: number = 0;
  cant_pasajeros_asientos_vuelta: number = 0;

  datos_infante_detalle: any = [];
  lista_infante_detalle: any = [];
  errorDatosInfante: number = 0;
  listaArrayAdultosSeleccion: any = [];
  listaDocumentApoderados: any = [];

  tiempoPagoPasarelaWeb: number = 0;
  myIp: string = "";
  code_pais: string = "51";

  servicioIda: string = "";
  servicioVuelta: string = "";
  idServicioIda: number = 0;
  idServicioVuelta: number = 0;
  idItinerario_ida: string = "";
  idRuta_ida: string = "";
  idItinerario_vuelta: string = "";
  idRuta_vuelta: string = "";
  fechaSalida: string = "";
  fechaVuelta: string = "";

  estructura_bus_ida: any = [];
  estructura_bus_vuelta: any = [];

  ida_vuelta: number = 0;
  validarcampos: boolean = true;
  TerminosCondiciones: any = [];

  cuponAplicado: number = 0;
  porcentaje_descontarIda: number = 0;
  porcentaje_descontarVuelta: number = 0;
  
  /* CUPONES */
  contCupon: number = 0;
  idCuponIda: number = 0;
  idCuponVuelta: number = 0;
  nameCupon: string = "";
  cupon_ida_vuelta1: number = 0;
  cupon_ida_vuelta2: number = 0;
  cuponActivo: number = 0;
  porcentajeDescuentoCuponIda: any = 0;
  porcentajeDescuentoCuponVuelta: any = 0;
  montoDescuentoCuponIda: any = 0;
  montoDescuentoCuponVuelta: any = 0;
  usosAlAPlicarIda: any = 0;
  usosAlAPlicarVuelta: any = 0;
  cumpleCupon: number = 0;
  valAsientosPromocionIda: number = 0;
  valAsientosPromocionVuelta: number = 0;
  promocionIda: number = 0;
  promocionVuelta: number = 0;
  /* CUPONES */

  tituloMensajeAlerta: string = "";
  textoMensajeAlerta: string = "";

  //responseGenerarPago: any;

  ventaIdaVuelta: any = [];
  arrayCliente: any = [];
  subArrayFinal: any = [];
  ArrayFinal: any = [];

  DatosBackSubscription!: Subscription;

  codAgenciaOrigen: number = 0;
  idUsuarioSispas: number = 0;
  getDatosPasajeros: any = [];

  agenciaEmbarqueIda: string = "";
  agenciaDesembarqueIda: string = "";
  agenciaEmbarqueVuelta: string = "";
  agenciaDesembarqueVuelta: string = "";
  direccionEmbarqueIda: string = "";
  direccionDesembarqueIda: string = "";
  direccionEmbarqueVuelta: string = "";
  direccionDesembarqueVuelta: string = "";
  horaEmbarqueIda: string = "";
  horaDesembarqueIda: string = "";
  horaEmbarqueVuelta: string = "";
  horaDesembarqueVuelta: string = "";

  continuarPago: number = 0;
  mensajeFaltaLlenarCampo: string = "";

  flag_recibir_noticias: number = 0;

  fechaLiquidacion: string = "";

  cuenta_regresiva: string = "";
  minuto: number = 19;
  segundos: number = 60;

  promocionActiva: number = 0;
  promocionVentasIdIda: number = 0;
  promocionVentasIdVuelta: number = 0;
  precio_pasajeros_asientos_ida_original: number = 0;
  precio_pasajeros_asientos_vuelta_original: number = 0;
  precio_total_pasajeros_asientos_original: number = 0;

  NombreTarjeta: string = "";
  tarcreId: number = 64;
  pago_regular_promocion_tarjeta: number = 0;

  //TODO: 0=NO APARECE, 1=IDA, 2=VUELTA, 3=IDA Y VUELTA.
  DatosTarjetaMaestro: any = [
    {
      "promocionId": "0",
      "nombreTarjeta": "INTERBANK",
      "nombreCorto": "IBK",
      "urlImagen": "../assets/img/tarjetas/interbank.png",
      "idaVuelta": 0,
      "descuento": "0",
      "div": "div_tarjeta_interbank",
      "width": 80, 
      "br_top": 1,
      "br_bottom": 1,
      "stock": "0",
      "tarcreId": 13
    },
    {
      "promocionId": "0",
      "nombreTarjeta": "BBVA",
      "nombreCorto": "BBVA",
      "urlImagen": "../assets/img/tarjetas/bbva.png",
      "idaVuelta": 0,
      "descuento": "0",
      "div": "div_tarjeta_bbva",
      "width": 52,
      "br_top": 1,
      "br_bottom": 1,
      "stock": "0",
      "tarcreId": 14
    },
    {
      "promocionId": "0",
      "nombreTarjeta": "BCP",
      "nombreCorto": "BCP",
      "urlImagen": "../assets/img/tarjetas/bcp.png",
      "idaVuelta": 0,
      "descuento": "0",
      "div": "div_tarjeta_bcp",
      "width": 51,
      "br_top": 1,
      "br_bottom": 1,
      "stock": "0",
      "tarcreId": 12
    },
    {
      "promocionId": "0",
      "nombreTarjeta": "BANCO DE LA NACIÓN",
      "nombreCorto": "BANCO DE LA NACION",
      "urlImagen": "../assets/img/tarjetas/banco_nacion.svg",
      "idaVuelta": 0,
      "descuento": "0",
      "div": "div_tarjeta_banco_nacion",
      "width": 77,
      "br_top": 0,
      "br_bottom": 1,
      "stock": "0",
      "tarcreId": 6
    },
    {
      "promocionId": "0",
      "nombreTarjeta": "SCOTIABANK",
      "nombreCorto": "SCOT",
      "urlImagen": "../assets/img/tarjetas/scotiabank.png",
      "idaVuelta": 0,
      "descuento": "0",
      "div": "div_tarjeta_scotiabank",
      "width": 65.5,
      "br_top": 1,
      "br_bottom": 1,
      "stock": "0",
      "tarcreId": 7
    },
    {
      "promocionId": "0",
      "nombreTarjeta": "CMR FALABELLA",
      "nombreCorto": "FALABELLA",
      "urlImagen": "../assets/img/tarjetas/falabella.png",
      "idaVuelta": 0,
      "descuento": "0",
      "div": "div_tarjeta_cmr",
      "width": 38,
      "br_top": 0,
      "br_bottom": 0,
      "stock": "0",
      "tarcreId": 35
    }
  ];

  DatosTarjeta: any = [];
  PromocionTarjetaActiva: any = {};

  id_tipo_documento: number = 1;
  nombreTipDoc: string = "DNI";
  numero_documento: string = "";
  limite_maximo_numero_documento: number = 8;
  texto_mensaje_alerta: string = "";
  tipo_entrada_teclado: string = "NUMERICO";    //NUMERICO
  val_buscar_pasajero: number = 0;

  cont_posicion_pasajero: number = 1;
  id_anterior: string = "";

  nombre_tipo_de_compra: string = "";
  numero_ruc: string = "";
  limite_maximo_numero_ruc: number = 11;
  texto_mensaje_alerta_ruc: string = "";

  elem: any;
  openScreen: number = 0;

  cont_mayuscula: number = 0;
  texto_id: string = "";
  div_seleccionado: string = "vista_mostrar_datos_pasajeros";
  cont_pasajero_nuevo: number = 0;
  texto_boleta_factura: string = "";
  mensaje_alerta_boleta_factura: string = "Seleccione una Boleta o Factura.";

  val_factura_new: number = 0;
  tip_opc_teclado: string = "";

  cantidadFinalPromocionIda: number = 0;
  cantidadFinalPromocionVuelta: number = 0;

  descripcionEscalasIda: string = "";
  descripcionEscalasVuelta: string = "";

  simularPagos: number = 0; // 0=NO, 1=SI

  constructor(private router:Router, private route: ActivatedRoute, private sharedService:SharedService, private http : HttpClient, private taskService: TaskService, @Inject(PLATFORM_ID) private platformId: Object, private sanitizer: DomSanitizer, @Inject(DOCUMENT) private document: any, public appComponent: AppComponent) {
    this.date = new Date();
    var dia = "";
    if(Number(this.date.getDate()) < 10){
      dia = "0"+ this.date.getDate();
    }else{
      dia = String(this.date.getDate());
    }
    var mes = "";
    if(Number(this.date.getMonth() + 1) < 10){
      mes = "0"+ Number(this.date.getMonth() + 1);
    }else{
      mes = String(this.date.getMonth() + 1);
    }
    var anio = this.date.getFullYear();

    //this.date_min_salida = this.date.getFullYear()+"-"+0+Number(this.date.getMonth()+1)+"-"+this.date.getDate();
    this.date_hoy = anio + "-" + mes + "-" + dia;
  }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId)){
      this.innerWidth = window.innerWidth;
      this.innerHeight = window.innerHeight;

      //this.mostrar_modal("modalAgregarInfante");

      this.elem = document.documentElement;

      //this.appComponent.clearInterval();
      //this.appComponent.temporizador(19, 50);

      //this.activar_teclado_alfanumerico("rucSolicitaFactura", "vista_mostrar_tipo_de_compra");
    }
  }

  ngOnDestroy() {
    if(isPlatformBrowser(this.platformId)){
      //this.DatosBackSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(){
    if(isPlatformBrowser(this.platformId)){
      let getDatosConfiguracion = JSON.parse(localStorage.getItem('StorageDatosConfiguracion') || '{}');
      if(JSON.stringify(getDatosConfiguracion)!="{}"){
        this.codAgenciaOrigen = getDatosConfiguracion['codAgenciaOrigen'];
        this.idUsuarioSispas = getDatosConfiguracion['idUsuarioSispas'];

        // ? ************************************ EXTRAER ESTADO DE CAJA ************************************
        let getEstadoCaja = JSON.parse(localStorage.getItem('StorageEstadoCaja') || '{}');
        if(JSON.stringify(getEstadoCaja) != "{}" && getEstadoCaja['result'] == true){
          this.fechaLiquidacion = getEstadoCaja['mensaje'];
        }
        // ? ************************************ EXTRAER ESTADO DE CAJA ************************************
      }

      setTimeout(() => {
        let getDatosPasajeros = JSON.parse(localStorage.getItem('StorageDatosPasajeros') || '{}');
        
        if(JSON.stringify(getDatosPasajeros)!="{}"){
          this.getDatosPasajeros = getDatosPasajeros;
          console.log(getDatosPasajeros);
          
          this.taskService.getTipoDocumento().subscribe(response => {
            //console.log(response);
            this.tipos_documentos = response;
          });

          this.nombre_ciudad_origen = this.textCapitalize(getDatosPasajeros['nombre_ciudad_origen']);
          this.nombre_ciudad_destino = this.textCapitalize(getDatosPasajeros['nombre_ciudad_destino']);
          this.num_asientos_ida = getDatosPasajeros['numAsientosIda'];
          this.num_asientos_vuelta = getDatosPasajeros['numAsientosVuelta'];
          this.nombreFechaEmbarqueIda = this.convert_nom_fecha(getDatosPasajeros['fechaEmbarqueIda']);
          this.idItinerario_ida = getDatosPasajeros['idItinerarioIda'];
          this.idRuta_ida = getDatosPasajeros['idRutaIda'];
          this.servicioIda = getDatosPasajeros['servicioIda'];
          this.idServicioIda = getDatosPasajeros['idServicioIda'];
          this.fechaSalida = getDatosPasajeros['fechaEmbarqueIda'];
          this.precio_asientos_ida = getDatosPasajeros['precioAsientosIda'];
          this.idItinerario_vuelta = getDatosPasajeros['idItinerarioVuelta'];
          this.idRuta_vuelta = getDatosPasajeros['idRutaVuelta'];
          this.servicioVuelta = getDatosPasajeros['servicioVuelta'];
          this.idServicioVuelta = getDatosPasajeros['idServicioVuelta'];
          this.fechaVuelta = getDatosPasajeros['fechaEmbarqueVuelta'];
          this.precio_asientos_ida = getDatosPasajeros['precioAsientosVuelta'];
          this.nombreFechaEmbarqueVuelta = this.convert_nom_fecha(getDatosPasajeros['fechaEmbarqueVuelta']);
          this.num_asientos_ida_p1 = getDatosPasajeros['numAsientosIdaP1'];
          this.num_asientos_ida_p2 = getDatosPasajeros['numAsientosIdaP2'];
          this.num_asientos_vuelta_p1 = getDatosPasajeros['numAsientosVueltaP1'];
          this.num_asientos_vuelta_p2 = getDatosPasajeros['numAsientosVueltaP2'];

          this.agenciaEmbarqueIda = getDatosPasajeros['agenciaEmbarqueIda'];
          this.agenciaDesembarqueIda = getDatosPasajeros['agenciaDesembarqueIda'];
          this.agenciaEmbarqueVuelta = getDatosPasajeros['agenciaEmbarqueVuelta'];
          this.agenciaDesembarqueVuelta = getDatosPasajeros['agenciaDesembarqueVuelta'];

          this.direccionEmbarqueIda = getDatosPasajeros['direccionEmbarqueIda'];
          this.direccionDesembarqueIda = getDatosPasajeros['direccionDesembarqueIda'];
          this.direccionEmbarqueVuelta = getDatosPasajeros['direccionEmbarqueVuelta'];
          this.direccionDesembarqueVuelta = getDatosPasajeros['direccionDesembarqueVuelta'];
          this.horaEmbarqueIda = getDatosPasajeros['horaEmbarqueIda'];
          this.horaDesembarqueIda = getDatosPasajeros['horaDesembarqueIda'];
          this.horaEmbarqueVuelta = getDatosPasajeros['horaEmbarqueVuelta'];
          this.horaDesembarqueVuelta = getDatosPasajeros['horaDesembarqueVuelta'];

          this.descripcionEscalasIda = this.generarDescripcionEscalasIda(getDatosPasajeros['descripcionEscalasIda']);
          this.descripcionEscalasVuelta = this.generarDescripcionEscalasVuelta(getDatosPasajeros['descripcionEscalasVuelta']);

          //this.precio_ida_total = getDatosPasajeros['precioTotalIda'];
          //this.precio_vuelta_total = getDatosPasajeros['precioTotalVuelta'];
          //this.precio_total = getDatosPasajeros['precioTotalIda'] + getDatosPasajeros['precioTotalVuelta'];

          this.ida_vuelta = getDatosPasajeros['ida_vuelta'];
          
          if(getDatosPasajeros['ida_vuelta'] == 1){
            this.numeroPagina = 4;
          }else{
            this.numeroPagina = 6;
          }

          /* TERMINOS Y CONDICIONES */
          this.taskService.getTerminosCondiciones().subscribe(responseTerminosCondiciones => {
            this.TerminosCondiciones = responseTerminosCondiciones;
          });
          /* TERMINOS Y CONDICIONES */

          /* PROMOCIONES SISPAS */
          var itinerarioVuelta, rutaVuelta, fechaRutVuelta;
          if(getDatosPasajeros['idItinerarioVuelta'] == ""){
            itinerarioVuelta = 0;
            rutaVuelta = 0;
            fechaRutVuelta = "fecha";
          }else{
            itinerarioVuelta = getDatosPasajeros['idItinerarioVuelta'];
            rutaVuelta = getDatosPasajeros['idRutaVuelta'];
            fechaRutVuelta = getDatosPasajeros['fechaEmbarqueVuelta'];
          }
          this.taskService.getPromocionesSispas(getDatosPasajeros['idItinerarioIda'], getDatosPasajeros['idRutaIda'], getDatosPasajeros['fechaEmbarqueIda'], itinerarioVuelta, rutaVuelta, fechaRutVuelta).subscribe(responsePromocionesSispas => {
            //console.log(responsePromocionesSispas);
            //console.log(this.DatosTarjetaMaestro);

            this.DatosTarjeta = [];

            if(responsePromocionesSispas.length > 0){
              for(var aa=0; aa<this.DatosTarjetaMaestro.length; aa++){
                for(var bb=0; bb<responsePromocionesSispas.length; bb++){
                  if(responsePromocionesSispas[bb]['c_denominacion'].includes(this.DatosTarjetaMaestro[aa]['nombreCorto'])){
                    if(responsePromocionesSispas[bb]['idaVuelta'] == 'IDA'){
                      this.DatosTarjetaMaestro[aa]['promocionId'] = responsePromocionesSispas[bb]['promocion_id'];
                      this.DatosTarjetaMaestro[aa]['idaVuelta'] = 1;
                      this.DatosTarjetaMaestro[aa]['descuento'] = responsePromocionesSispas[bb]['n_valdes'];
                      this.DatosTarjetaMaestro[aa]['stock'] = responsePromocionesSispas[bb]['stock'];
                    }
                  }
                }
              }

              for(var aa=0; aa<this.DatosTarjetaMaestro.length; aa++){
                for(var bb=0; bb<responsePromocionesSispas.length; bb++){
                  if(responsePromocionesSispas[bb]['c_denominacion'].includes(this.DatosTarjetaMaestro[aa]['nombreCorto'])){
                    if(responsePromocionesSispas[bb]['idaVuelta'] == 'VUELTA'){
                      if(this.DatosTarjetaMaestro[aa]['idaVuelta'] == 0){
                        this.DatosTarjetaMaestro[aa]['promocionId'] = responsePromocionesSispas[bb]['promocion_id'];
                        this.DatosTarjetaMaestro[aa]['idaVuelta'] = 2;
                        this.DatosTarjetaMaestro[aa]['descuento'] = responsePromocionesSispas[bb]['n_valdes'];
                        this.DatosTarjetaMaestro[aa]['stock'] = responsePromocionesSispas[bb]['stock'];
                      }else if(this.DatosTarjetaMaestro[aa]['idaVuelta'] == 1){
                        this.DatosTarjetaMaestro[aa]['idaVuelta'] = 3;
                        this.DatosTarjetaMaestro[aa]['promocionId'] = this.DatosTarjetaMaestro[aa]['promocionId']+","+responsePromocionesSispas[bb]['promocion_id'];
                        this.DatosTarjetaMaestro[aa]['descuento'] = this.DatosTarjetaMaestro[aa]['descuento']+","+responsePromocionesSispas[bb]['n_valdes'];
                        this.DatosTarjetaMaestro[aa]['stock'] = this.DatosTarjetaMaestro[aa]['stock']+","+responsePromocionesSispas[bb]['stock'];
                      }
                    }
                  }
                }
              }

              setTimeout(() => {
                for(var cc=0; cc<this.DatosTarjetaMaestro.length; cc++){
                  if(this.DatosTarjetaMaestro[cc]['idaVuelta'] == 1 && this.DatosTarjetaMaestro[cc]['stock'] > 0){
                    this.DatosTarjeta.push(this.DatosTarjetaMaestro[cc]);
                  }else if(this.DatosTarjetaMaestro[cc]['idaVuelta'] == 2 && this.DatosTarjetaMaestro[cc]['stock'] > 0){
                    this.DatosTarjeta.push(this.DatosTarjetaMaestro[cc]);
                  }else if(this.DatosTarjetaMaestro[cc]['idaVuelta'] == 3){
                    this.DatosTarjeta.push(this.DatosTarjetaMaestro[cc]);
                  }
                }
                
                $("#div_pago_tarjeta_promociones").css("display", "inline");
              },1000);
            }else{
              // ! NO HAY DATA
              this.tarcreId = 64;

              $("#div_pago_tarjeta_promociones").css("display", "none");
            }
          });
          /* PROMOCIONES SISPAS */

          /* PASAJEROS */
          if(this.num_asientos_ida.includes(",") || this.num_asientos_ida!=""){
            var part_asi = this.num_asientos_ida.split(",");
            if(part_asi.length != 0){
              for(var a=0; a<part_asi.length; a++){
                var part_asi2 = part_asi[a].toString().split("-");

                var array = {asiento: part_asi2[0], precio: getDatosPasajeros['precioAsientosIda'][a], piso: Number(part_asi2[1])};
                this.pasajero_asientos_ida.push(array);
              }
            }
          }

          if(this.num_asientos_vuelta.includes(",") || this.num_asientos_vuelta!=""){
            var part_asi = this.num_asientos_vuelta.split(",");
            if(part_asi.length != 0){
              for(var a=0; a<part_asi.length; a++){
                var part_asi2 = part_asi[a].toString().split("-");

                var array = {asiento: part_asi2[0], precio: getDatosPasajeros['precioAsientosVuelta'][a], piso: Number(part_asi2[1])};
                this.pasajero_asientos_vuelta.push(array);
              }
            }
          }

          if((this.num_asientos_ida.includes(",") || this.num_asientos_ida!="") && (this.num_asientos_vuelta.includes(",") || this.num_asientos_vuelta!="")){
            var part_asi_ida = this.num_asientos_ida.split(",");
            var part_asi_vuelta = this.num_asientos_vuelta.split(",");
            if(part_asi_ida.length != 0){
              for(var a=0; a<part_asi_ida.length; a++){
                var part_asi_ida2 = part_asi_ida[a].toString().split("-");
                var part_asi_vuelta2 = part_asi_vuelta[a].toString().split("-");

                var array_ida_vuelta = {asiento_ida: part_asi_ida2[0], asiento_vuelta: part_asi_vuelta2[0], precio_ida: getDatosPasajeros['precioAsientosIda'][a], precio_vuelta: getDatosPasajeros['precioAsientosVuelta'][a], piso_ida: Number(part_asi_ida2[1]), piso_vuelta: Number(part_asi_vuelta2[1]), porcentaje_descuento_ida: 0, porcentaje_descuento_vuelta: 0};
                this.pasajero_asientos.push(array_ida_vuelta);
              }
            }
          }

          if((this.num_asientos_ida.includes(",") || this.num_asientos_ida!="") && this.num_asientos_vuelta==""){
            var part_asi_ida = this.num_asientos_ida.split(",");
            if(part_asi_ida.length != 0){
              for(var a=0; a<part_asi_ida.length; a++){
                var part_asi_ida2 = part_asi_ida[a].toString().split("-");

                var array_ida_vuelta = {asiento_ida: part_asi_ida2[0], asiento_vuelta: '', precio_ida: getDatosPasajeros['precioAsientosIda'][a], precio_vuelta: getDatosPasajeros['precioAsientosVuelta'][a], piso_ida: Number(part_asi_ida2[1]), piso_vuelta: 0, porcentaje_descuento_ida: 0, porcentaje_descuento_vuelta: 0};
                this.pasajero_asientos.push(array_ida_vuelta);
              }
            }
          }

          for(var a=0; a<this.pasajero_asientos_ida.length; a++){
            this.pasajero_asientos_ida[a].asiento;
            if(a==0){ this.list_pasajeros_asientos_ida = this.pasajero_asientos_ida[a].asiento;
            }else{ this.list_pasajeros_asientos_ida = this.list_pasajeros_asientos_ida + "," + this.pasajero_asientos_ida[a].asiento;
            }
            this.precio_pasajeros_asientos_ida = Number(this.pasajero_asientos_ida[a].precio) + this.precio_pasajeros_asientos_ida;
            this.cant_pasajeros_asientos_ida++;
          }

          for(var a=0; a<this.pasajero_asientos_vuelta.length; a++){
            this.pasajero_asientos_vuelta[a].asiento;
            if(a==0){ this.list_pasajeros_asientos_vuelta = this.pasajero_asientos_vuelta[a].asiento;
            }else{ this.list_pasajeros_asientos_vuelta = this.list_pasajeros_asientos_vuelta + "," + this.pasajero_asientos_vuelta[a].asiento;
            }
            this.precio_pasajeros_asientos_vuelta = Number(this.pasajero_asientos_vuelta[a].precio) + this.precio_pasajeros_asientos_vuelta;
            this.cant_pasajeros_asientos_vuelta++;
          }

          this.precio_total_pasajeros_asientos = this.precio_pasajeros_asientos_ida + this.precio_pasajeros_asientos_vuelta;
          /* PASAJEROS */

          this.precio_pasajeros_asientos_ida_original = this.precio_pasajeros_asientos_ida;
          this.precio_pasajeros_asientos_vuelta_original = this.precio_pasajeros_asientos_vuelta;
          this.precio_total_pasajeros_asientos_original = this.precio_total_pasajeros_asientos;

          // LIBERAR ASIENTOS
          /*var cont_back = 0;

          this.DatosBackSubscription = this.sharedService.getDatosBack().subscribe((datos_response: any)=>{
            cont_back++;
            
            if(cont_back == 1){              
              if(this.num_asientos_vuelta == ""){
                if(getDatosPasajeros['numAsientosIda'].includes(",")){
                  var part_asi = getDatosPasajeros['numAsientosIda'].split(",");
    
                  for(var a=0; a<part_asi.length; a++){
                    var part_asi2 = String(part_asi[a]).split("-");
                    let list_asientos: any = [];
                    let list_pisos: any = [];
  
                    list_asientos.push(Number(part_asi2[0]));
                    list_pisos.push(Number(part_asi2[1])); 
                  
                    var part_fecha = getDatosPasajeros['fechaEmbarqueIda'].split("-");
                    var fecha_partida = part_fecha[2]+"/"+part_fecha[1]+"/"+part_fecha[0];
            
                    this.taskService.deleteLiberarAsiento(Number(getDatosPasajeros['idRutaIda']), Number(getDatosPasajeros['idItinerarioIda']), fecha_partida, list_asientos, getDatosPasajeros['horaEmbarqueIda'], list_pisos, 5, Number(getDatosPasajeros['precioAsientosIda'][a]), "").subscribe(response => {
                      if(response['result'] == true){
                        //console.log("Se desbloqueó el asiento.");
                      }else{
                        //console.log("No se desbloqueó el asiento.");
                      }
                    });
                  }
                }else if(getDatosPasajeros['numAsientosIda']!="" && !getDatosPasajeros['numAsientosIda'].includes(",")){
                  var part_asi = getDatosPasajeros['numAsientosIda'].split("-");
                  var part_fecha = getDatosPasajeros['fechaEmbarqueIda'].split("-");
                  var fecha_partida = part_fecha[2]+"/"+part_fecha[1]+"/"+part_fecha[0];
  
                  let list_asientos: any = [];
                  let list_pisos: any = [];
  
                  list_asientos.push(Number(part_asi[0]));
                  list_pisos.push(Number(part_asi[1])); 
            
                  this.taskService.deleteLiberarAsiento(Number(getDatosPasajeros['idRutaIda']), Number(getDatosPasajeros['idItinerarioIda']), fecha_partida, list_asientos, getDatosPasajeros['horaEmbarqueIda'], list_pisos, 5, Number(getDatosPasajeros['precioAsientosIda']), "").subscribe(response => {
                    if(response['result'] == true){
                      //console.log("Se desbloqueó el asiento.");
                    }else{
                      //console.log("No se desbloqueó el asiento.");
                    }
                  });
                }
              }else{
                if(getDatosPasajeros['numAsientosVuelta'].includes(",")){
                  var part_asi = getDatosPasajeros['numAsientosVuelta'].split(",");
    
                  for(var a=0; a<part_asi.length; a++){
                    var part_asi2 = String(part_asi[a]).split("-");
                    let list_asientos: any = [];
                    let list_pisos: any = [];
  
                    list_asientos.push(Number(part_asi2[0]));
                    list_pisos.push(Number(part_asi2[1])); 
                  
                    var part_fecha = getDatosPasajeros['fechaEmbarqueVuelta'].split("-");
                    var fecha_partida = part_fecha[2]+"/"+part_fecha[1]+"/"+part_fecha[0];
            
                    this.taskService.deleteLiberarAsiento(Number(getDatosPasajeros['idRutaVuelta']), Number(getDatosPasajeros['idItinerarioVuelta']), fecha_partida, list_asientos, getDatosPasajeros['horaEmbarqueVuelta'], list_pisos, 5, Number(getDatosPasajeros['precioAsientosVuelta'][a]), "").subscribe(response => {
                      if(response['result'] == true){
                        //console.log("Se desbloqueó el asiento.");
                      }else{
                        //console.log("No se desbloqueó el asiento.");
                      }
                    });
                  }
                }else if(getDatosPasajeros['numAsientosVuelta']!="" && !getDatosPasajeros['numAsientosVuelta'].includes(",")){
                  var part_asi = getDatosPasajeros['numAsientosVuelta'].split("-");
                  var part_fecha = getDatosPasajeros['fechaEmbarqueVuelta'].split("-");
                  var fecha_partida = part_fecha[2]+"/"+part_fecha[1]+"/"+part_fecha[0];
  
                  let list_asientos: any = [];
                  let list_pisos: any = [];
  
                  list_asientos.push(Number(part_asi[0]));
                  list_pisos.push(Number(part_asi[1])); 
            
                  this.taskService.deleteLiberarAsiento(Number(getDatosPasajeros['idRutaVuelta']), Number(getDatosPasajeros['idItinerarioVuelta']), fecha_partida, list_asientos, getDatosPasajeros['horaEmbarqueVuelta'], list_pisos, 5, Number(getDatosPasajeros['precioAsientosVuelta']), "").subscribe(response => {
                    if(response['result'] == true){
                      //console.log("Se desbloqueó el asiento.");
                    }else{
                      //console.log("No se desbloqueó el asiento.");
                    }
                  });
                }
              }
            }
          });*/

          $("#vista_llenar_datos").css("display", "inline");
          
          //$("#vista_pagar").css("display", "none");           //@elujan--

          $("#vista_pagar_imagenes").css("display", "none");

          $(".loader").fadeOut("slow");
          //$("#vista_cargando").css("display", "none");

          //@elujan++
          //$("#vista_llenar_datos").css("display", "none");
          //$("#vista_pagar").css("display", "none");
          //$("#vista_pagar_prueba").css("display", "inline");
          //$("#vista_pagar_imagenes").css("display", "none");
          //$(".loader").fadeOut("slow");
        }
      });

      /*var val_interval = 0;
      var intervalo_tiempo = setInterval(() => {
        if(this.numeroPagina == 4 || this.numeroPagina == 6){
          val_interval = 1;
        }else{
          val_interval = 0;
        }

        if(val_interval == 1){
          $('#palabra_time1').css('display', 'inline');
          this.segundos = this.segundos - 1;
          if(this.segundos == 0){
            if(this.minuto > 0){
              this.minuto = this.minuto - 1;
              this.segundos = 59;
            }
          }
          if(this.segundos > -1){
            var time = this.minuto+":"+this.segundos;
            this.cuenta_regresiva = time;
          }else{
            //console.log("SE ACABO EL TIEMPO");
            clearInterval(intervalo_tiempo);

            //this.router.navigate(['']);
          }
        }else if(val_interval == 0){
          $('#palabra_time1').css('display', 'none');
          this.minuto = 19;
          this.segundos = 60;
          clearInterval(intervalo_tiempo);
        }
      }, 1000);*/
    }
  }

  generarDescripcionEscalasIda(descripcionEscalas: string){
    var nombre_origen = "";
    if(this.nombre_ciudad_origen.includes("Lima")){ nombre_origen = "LIMA"; }else{ nombre_origen = this.nombre_ciudad_origen; }

    var nombre_destino = "";
    if(this.nombre_ciudad_destino.includes("Lima")){ nombre_destino = "LIMA"; }else{ nombre_destino = this.nombre_ciudad_destino; }

    return this.obtenerTramosIntermedios(descripcionEscalas, nombre_origen, nombre_destino);
  }

  generarDescripcionEscalasVuelta(descripcionEscalas: string){
    var nombre_origen = "";
    if(this.nombre_ciudad_origen.includes("Lima")){ nombre_origen = "LIMA"; }else{ nombre_origen = this.nombre_ciudad_origen; }

    var nombre_destino = "";
    if(this.nombre_ciudad_destino.includes("Lima")){ nombre_destino = "LIMA"; }else{ nombre_destino = this.nombre_ciudad_destino; }

    return this.obtenerTramosIntermedios(descripcionEscalas, nombre_destino, nombre_origen);
  }

  textCapitalize(str: string){
    const capitalize = str.slice(0, 1).toUpperCase() + (true ? str.slice(1).toLowerCase() : str.slice(1));

    return capitalize;
  }

  ContinuarPago(){
    if(this.fechaLiquidacion != ""){
      //this.mensajeFaltaLlenarCampo = "Desactive la casilla de infante si no va a llevar uno a bordo.";

      this.validarcampos = this.validarCampos(3);
      
      if(this.validarcampos == true){
        $(".loader").fadeIn("slow");

        /*$('#vista_llenar_datos').css('display', 'none');
        $('#vista_pagar').css('display', 'inline');

        $('#icon_back_page').css('display', 'none');
        $('#icon_back_page_llenado_datos').css('display', 'inline');*/



        //@elujan++
        /*$("#vista_llenar_datos").css("display", "none");
        $("#vista_pagar").css("display", "none");
        $("#vista_pagar_prueba").css("display", "inline");
        $("#vista_pagar_imagenes").css("display", "none");*/

        $("#vista_mostrar_resumen_compra").css("display", "none");
        $('#vista_pagar').css('display', 'inline');
        $(".loader").fadeOut("slow");

        this.continuarPago = 1;
      }else if(this.validarcampos == false){
        this.notificacion_mensajes_alerta("Error", this.mensajeFaltaLlenarCampo);
      }

      $(".loader").fadeOut("slow");
    }else{
      //MENSAJE DE ALERTA DE LIQUIDACION
      this.notificacion_mensajes_alerta("Error", "Debe tener una liquidación abierta.");
    }
  }

  atras(){
    if(this.continuarPago == 0){
      this.sharedService.enviarDatosBack();

      if(this.ida_vuelta == 1){
        this.router.navigate(['asientos']);
      }else{
        this.router.navigate(['asientos-retorno']);
      }
    }else{
      this.continuarPago = 0;
      
      $(".loader").fadeIn("slow");

      /*$('#vista_llenar_datos').css('display', 'inline');
      $('#vista_pagar').css('display', 'none');
      $("#vista_pagar_prueba").css("display", "none");

      $('#icon_back_page').css('display', 'inline');
      $('#icon_back_page_llenado_datos').css('display', 'none');*/

      $('#vista_pagar').css('display', 'none');
      $('#vista_mostrar_resumen_compra').css('display', 'inline');

      $(".loader").fadeOut("slow");
    }
  }

  validarCampos(sector: number){
    if(isPlatformBrowser(this.platformId)){
      /************************************ VALIDAR CAMPOS VACIOS ************************************/
      if(sector == 1){
        for(var a=0; a<this.pasajero_asientos.length; a++){
          var camp_txtdocumento = "txtdocumento_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta;
          var camp_txtnombres = "txtnombres_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta;
          var camp_txtapellidos = "txtapellidos_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta;
          var camp_txtedad = "edad_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta;
          var camp_txtfechanacimiento = "fecha_nacimiento_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta;
          var rd_radio_1 = "inlineRadio_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta+"_1";
          var rd_radio_2 = "inlineRadio_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta+"_2";
          var chk_vincular_infante = "flexSwitchCheckInfante_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta;
          var input_vincular_infante = "dni_datos_infante_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta;
          var btn_vincular_infante = "btn_agregar_infante_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta;
          var chk_vincular_apoderado = "flexSwitchCheckInfante2_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta;
          var input_vincular_apoderado = "TipDocApoderado_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta;

          if($('#'+camp_txtdocumento).val() == ""){
            $('#'+camp_txtdocumento).addClass("empty_datos");
            this.mensajeFaltaLlenarCampo = "Falta llenar su Número de Documento.";
            return false;
          }else{
            $('#'+camp_txtdocumento).removeClass("empty_datos");
          }

          if($('#'+camp_txtnombres).val() == ""){
            $('#'+camp_txtnombres).addClass("empty_datos");
            this.mensajeFaltaLlenarCampo = "Falta llenar sus Nombres.";
            return false;
          }else{
            $('#'+camp_txtnombres).removeClass("empty_datos");
          }

          if($('#'+camp_txtapellidos).val() == ""){
            $('#'+camp_txtapellidos).addClass("empty_datos");
            this.mensajeFaltaLlenarCampo = "Falta llenar sus Apellidos.";
            return false;
          }else{
            $('#'+camp_txtapellidos).removeClass("empty_datos");
          }

          /*if($('#'+camp_txtedad).val() == "" || $('#'+camp_txtedad).val() == "NaN"){
            $('#'+camp_txtedad).addClass("empty_datos");
            $('#'+camp_txtfechanacimiento).addClass("empty_datos");
            return false;
          }else{
            $('#'+camp_txtedad).removeClass("empty_datos");
            $('#'+camp_txtfechanacimiento).removeClass("empty_datos");
          }*/

          if($('#'+camp_txtfechanacimiento).val() == "" || $('#'+camp_txtfechanacimiento).val() == "NaN"){
            $('#'+camp_txtfechanacimiento).addClass("empty_datos");
            return false;
          }else{
            $('#'+camp_txtfechanacimiento).removeClass("empty_datos");
          }

          if($('#'+rd_radio_1).is(":checked") == false && $('#'+rd_radio_2).is(":checked") == false){
            $('#'+rd_radio_1).addClass("empty_datos");
            $('#'+rd_radio_2).addClass("empty_datos");

            this.mensajeFaltaLlenarCampo = "Falta activar la casilla del Sexo.";
            return false;
          }else{
            $('#'+rd_radio_1).removeClass("empty_datos");
            $('#'+rd_radio_2).removeClass("empty_datos");
          }
          
          if($('#'+chk_vincular_infante).is(":checked") == true){
            if($('#'+input_vincular_infante).val() == ""){
              $('#'+btn_vincular_infante).addClass("empty_datos");
              return false;
            }
          }else{
            $('#'+btn_vincular_infante).removeClass("empty_datos");
          }

          if($('#'+chk_vincular_apoderado).is(":checked") == true){
            if($('#'+input_vincular_apoderado).val() == ""){
              $('#'+input_vincular_apoderado).addClass("empty_datos");
              return false;
            }
          }else{
            $('#'+input_vincular_apoderado).removeClass("empty_datos");
          }
        }

        if($('#emailDatosContacto').val() == "" || this.validarEmail($('#emailDatosContacto').val()) == false){
          $('#emailDatosContacto').addClass("empty_datos");
          this.mensajeFaltaLlenarCampo = "Falta llenar su Correo Electrónico.";
          return false;
        }else{
          $('#emailDatosContacto').removeClass("empty_datos");
        }

        /*if($('#chkSolicitaFactura').is(":checked") == true && this.validarRUC($('#rucSolicitaFactura').val()) == false){
          return false;
        }*/

        if(String($('#numeroDatosContacto').val()) == ""){
          $('#numeroDatosContacto').addClass("empty_datos");
          this.mensajeFaltaLlenarCampo = "Falta llenar su Número Telefónico.";
          return false;
        }else{
          $('#numeroDatosContacto').removeClass("empty_datos");
        }
      }
      /************************************ VALIDAR CAMPOS VACIOS ************************************/

      if(sector == 1){
        if($('#rucSolicitaFactura').val() != "" && $('#razonSolicitaFactura').val() == "" && $('#direccionSolicitaFactura').val() == ""){
          $('#rucSolicitaFactura').addClass("empty_datos");
          return false;
        }else{
          $('#rucSolicitaFactura').removeClass("empty_datos");
        }

        if($('#rucSolicitaFactura').val() != "" && $('#razonSolicitaFactura').val() == "" && $('#direccionSolicitaFactura').val() != ""){
          $('#rucSolicitaFactura').addClass("empty_datos");
          return false;
        }else{
          $('#rucSolicitaFactura').removeClass("empty_datos");
        }

        if($('#rucSolicitaFactura').val() != "" && $('#razonSolicitaFactura').val() != "" && $('#direccionSolicitaFactura').val() == ""){
          $('#rucSolicitaFactura').addClass("empty_datos");
          return false;
        }else{
          $('#rucSolicitaFactura').removeClass("empty_datos");
        }

        for(var a=0; a<this.TerminosCondiciones.length; a++){
          if(this.TerminosCondiciones[a].obligatorio == 1){
            if($('#chktermcond_'+this.TerminosCondiciones[a].termcond_id).is(":checked") == false){
              $('#chktermcond_'+this.TerminosCondiciones[a].termcond_id).addClass("empty_datos");
              this.mensajeFaltaLlenarCampo = "Falta marcar la casilla de los Términos y Condiciones.";
              return false;
            }else{
              $('#chktermcond_'+this.TerminosCondiciones[a].termcond_id).removeClass("empty_datos");
            }
          }
        }

        //TODO: RECIBIR NOTICIAS
        if($('#chktermcond_1').is(":checked") == false){
          this.flag_recibir_noticias = 0;
        }else{
          this.flag_recibir_noticias = 1;
        }
      }

      if(sector == 3){
        for(var a=0; a<this.TerminosCondiciones.length; a++){
          if(this.TerminosCondiciones[a].obligatorio == 1){
            if($('#chktermcond_'+this.TerminosCondiciones[a].termcond_id).is(":checked") == false){
              $('#chktermcond_'+this.TerminosCondiciones[a].termcond_id).addClass("empty_datos");
              this.mensajeFaltaLlenarCampo = "Falta marcar la casilla de los Términos y Condiciones.";
              return false;
            }else{
              $('#chktermcond_'+this.TerminosCondiciones[a].termcond_id).removeClass("empty_datos");
            }
          }
        }

        //TODO: RECIBIR NOTICIAS
        if($('#chktermcond_1').is(":checked") == false){
          this.flag_recibir_noticias = 0;
        }else{
          this.flag_recibir_noticias = 1;
        }
      }
    }

    return true;
  }

  searchDatosRuc(evt){
    if(isPlatformBrowser(this.platformId)){
      var text_ruc = $('#'+evt.target.id).val();
      
      if(this.cuponActivo == 1){
        this.EliminarCuponAplicado();
        this.notificacion_mensajes_alerta("Advertencia", "No se puede aplicar el Cupón en una factura.");
      }

      if(String(text_ruc).length > 10){
        $(".loader").fadeIn("slow");
        this.taskService.getDatosRuc(Number(text_ruc)).subscribe(response => {
          if(response != null){
            $("#idclienteSolicitaFactura").val(response['idcliente']);
            $("#flagSolicitaFactura").val(response['flag']);
            $("#razonSolicitaFactura").val(response['razonSocial']);
            $("#direccionSolicitaFactura").val(response['direccion']);

            $("#razonSolicitaFactura").prop("readonly", true);
            $("#direccionSolicitaFactura").prop("readonly", false);
          }else{
            if(this.validarRUC(text_ruc) == true){
              $("#idclienteSolicitaFactura").val("");
              $("#flagSolicitaFactura").val("");
              $("#razonSolicitaFactura").val("");
              $("#direccionSolicitaFactura").val("");

              $("#razonSolicitaFactura").prop("readonly", false);
              $("#direccionSolicitaFactura").prop("readonly", false);
            }else{
              $("#idclienteSolicitaFactura").val("");
              $("#flagSolicitaFactura").val("");
              $("#razonSolicitaFactura").val("");
              $("#direccionSolicitaFactura").val("");

              $("#razonSolicitaFactura").prop("readonly", true);
              $("#direccionSolicitaFactura").prop("readonly", true);
            }
          }
          $(".loader").fadeOut("slow");
          
        });
      }else{
        $("#razonSolicitaFactura").val("");
        $("#direccionSolicitaFactura").val("");
        $("#razonSolicitaFactura").prop("readonly", true);
        $("#direccionSolicitaFactura").prop("readonly", true);
      }
    }
  }

  validarEmail(email: any){
    var emailRegex;
    if(isPlatformBrowser(this.platformId)){
      emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    }
    return emailRegex.test(email);
  }

  validarRUC(ruc: any): boolean {
    if (isPlatformBrowser(this.platformId)) {
      ruc = String(ruc).trim();

      // ✅ Debe tener 11 dígitos
      if (!/^\d{11}$/.test(ruc)) return false;

      // ✅ Prefijos válidos según SUNAT
      const prefijosValidos = ["10", "15", "16", "17", "20"];
      if (!prefijosValidos.includes(ruc.substring(0, 2))) return false;

      // ✅ Factores de multiplicación SUNAT (10 primeros dígitos)
      const factores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
      let suma = 0;

      for (let i = 0; i < 10; i++) {
        suma += parseInt(ruc.charAt(i)) * factores[i];
      }

      const resto = suma % 11;
      const digitoVerificador = (11 - resto === 10) ? 0 :
                                (11 - resto === 11) ? 1 :
                                (11 - resto);

      return digitoVerificador === parseInt(ruc.charAt(10));
    }

    return false;
  }

  searchNameDocumento(evt){
    if(isPlatformBrowser(this.platformId)){
      var text_documento = $('#'+evt.target.id).val();
      if(String(text_documento).length > 7){
        var part_text = String(evt.target.id).split("_");
        var id_tipo_doc = $("#selectTipDoc_"+part_text[1]+"_"+part_text[2]).val();

        var txtidpasajero = "txtidpasajero_"+part_text[1]+"_"+part_text[2];
        var txtflagws = "txtflagws_"+part_text[1]+"_"+part_text[2];
        var id_text_nombres = "txtnombres_"+part_text[1]+"_"+part_text[2];
        var id_text_apellidos = "txtapellidos_"+part_text[1]+"_"+part_text[2];
        var id_fecha_nacimiento = "fecha_nacimiento_"+part_text[1]+"_"+part_text[2];
        var chck_femenino = "inlineRadio_"+part_text[1]+"_"+part_text[2]+"_1";
        var chck_masculino = "inlineRadio_"+part_text[1]+"_"+part_text[2]+"_2";

        $('#'+txtidpasajero).val(String(''));
        $('#'+txtflagws).val(String(''));
        $('#'+id_text_nombres).val(String(''));
        $('#'+id_text_apellidos).val(String(''));
        $('#'+id_fecha_nacimiento).val(String(''));
        $('#'+chck_femenino).prop("checked", false);
        $('#'+chck_masculino).prop("checked", false);

        if(this.pasajero_asientos.length == 1){
          $('#emailDatosContacto').val('');
          $('#numeroDatosContacto').val('');
        }

        //if(id_tipo_doc == 1){
          if(!String(text_documento).includes(" ")){
            $(".loader").fadeIn("slow");
            this.taskService.getNameDocumento(Number(id_tipo_doc), String(text_documento)).subscribe(response => {
              //console.log(response);

              if(response != null){
                $('#'+txtidpasajero).val(String(response['idpasajero']));
                $('#'+txtflagws).val(String(response['flagWS']));
                $('#'+id_text_nombres).val(String(response['nombre']));
                $('#'+id_text_apellidos).val(String(response['apePaterno'])+" "+String(response['apeMaterno']));
                var fecha = "";
                if(String(response['fechanacimiento']).includes("/")){
                  var partFecha = String(response['fechanacimiento']).split("/");
                  fecha = partFecha[2]+"-"+partFecha[1]+"-"+partFecha[0];
                }
                
                $('#'+id_fecha_nacimiento).val(String(fecha));
                this.aceptar_fecha_nacimiento(part_text[1]+"_"+part_text[2]);

                $("#"+id_text_nombres).prop("readonly", true);
                $("#"+id_text_apellidos).prop("readonly", true);

                if(Number(response['sexo']) == 1){
                  $('#'+chck_femenino).prop("checked", true);
                }else if(Number(response['sexo']) == 2){
                  $('#'+chck_masculino).prop("checked", true);
                }

                //if(this.pasajero_asientos.length == 1){
                  if(response['email'] != null){
                    $('#emailDatosContacto').val(String(response['email']));
                  }
                  if(response['telefono'] != null){
                    $('#numeroDatosContacto').val(String(response['telefono']));
                  }
                //}

                if(id_tipo_doc == 1 && String(text_documento).length>8){
                  $('#'+evt.target.id).val("");
                  $('#'+txtidpasajero).val("");
                  $('#'+txtflagws).val("");
                  $('#'+id_text_nombres).val("");
                  $('#'+id_text_apellidos).val("");
                  $("#"+id_text_nombres).prop("readonly", true);
                  $("#"+id_text_apellidos).prop("readonly", true);
                  $('#'+id_fecha_nacimiento).val("");
                }
              }else{
                $('#'+txtidpasajero).val(String(''));
                $('#'+txtflagws).val(String(''));
                $('#'+id_text_nombres).val(String(''));
                $('#'+id_text_apellidos).val(String(''));
                $('#'+id_fecha_nacimiento).val(String(''));

                $("#"+id_text_nombres).prop("readonly", false);
                $("#"+id_text_apellidos).prop("readonly", false);

                if(id_tipo_doc == 1){
                  var valoresAceptados = /^[0-9]+$/;
                  if (String(text_documento).match(valoresAceptados)){
                    $("#"+id_text_nombres).prop("readonly", false);
                    $("#"+id_text_apellidos).prop("readonly", false);
                  } else {
                    $("#"+id_text_nombres).prop("readonly", true);
                    $("#"+id_text_apellidos).prop("readonly", true);
                  }
                }

                if(id_tipo_doc == 1 && String(text_documento).length>8){
                  $('#'+evt.target.id).val("");
                  $('#'+txtidpasajero).val("");
                  $('#'+txtflagws).val("");
                  $('#'+id_text_nombres).val("");
                  $('#'+id_text_apellidos).val("");
                  $("#"+id_text_nombres).prop("readonly", true);
                  $("#"+id_text_apellidos).prop("readonly", true);
                  $('#'+id_fecha_nacimiento).val("");
                }
              }

              $(".loader").fadeOut("slow");
            });
          }else{
            this.mostrar_modal("modal_mensaje_sin_espacios");

            $('#'+txtidpasajero).val(String(''));
            $('#'+txtflagws).val(String(''));
            $('#'+id_text_nombres).val(String(''));
            $('#'+id_text_apellidos).val(String(''));

            $("#"+id_text_nombres).prop("readonly", true);
            $("#"+id_text_apellidos).prop("readonly", true);
          }
        //}else{
        //  $("#"+id_text_nombres).prop("readonly", false);
        //  $("#"+id_text_apellidos).prop("readonly", false);
        //}
      }else{
        if(text_documento == ""){
          var part_text = String(evt.target.id).split("_");
          this.aceptar_fecha_nacimiento(part_text[1]+"_"+part_text[2]);
        }
      }
    }
  }

  aceptar_fecha_nacimiento(asiento_ida_vuelta: string){
    var fechaNacimiento = $("#fecha_nacimiento_"+asiento_ida_vuelta).val();
    
    /****************************************************************************/
    var hoy = new Date();
    var cumpleanos = new Date(String(fechaNacimiento));
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if(m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())){
      edad--;
    }

    //$("#edad_"+asiento_ida_vuelta).val(edad);
    if($("#txtdocumento_"+asiento_ida_vuelta).val() != ""){
      if(edad>=6 && edad<18){
        $('#relacion_edad_'+asiento_ida_vuelta).val("Menor");
  
        $('#pregunta1_detalle_infante_'+asiento_ida_vuelta).css('display', 'none');
        $('#pregunta1_detalle_adolescente_'+asiento_ida_vuelta).css('display', 'inline-flex');
      }else{
        $('#relacion_edad_'+asiento_ida_vuelta).val("Adulto");
  
        $('#pregunta1_detalle_infante_'+asiento_ida_vuelta).css('display', 'inline-flex');
        $('#pregunta1_detalle_adolescente_'+asiento_ida_vuelta).css('display', 'none');
      }
    }
    /****************************************************************************/

    this.arrayAdultosSeleccion();

    //this.ocultar_modal("modal_fecha_nacimiento");
  }

  arrayAdultosSeleccion(){
    this.listaArrayAdultosSeleccion = [];

    for(var a=0; a<this.pasajero_asientos.length; a++){
      var id = this.pasajero_asientos[a]['asiento_ida']+"_"+this.pasajero_asientos[a]['asiento_vuelta'];

      var relacion_edad = $('#relacion_edad_'+id).val();
      var dni_adulto = $('#txtdocumento_'+id).val();

      if((relacion_edad == "Adulto" || relacion_edad == "Apoderado") && dni_adulto != ""){
        this.listaArrayAdultosSeleccion.push(dni_adulto);
      }
    }
  }

  searchDocumentoApoderado(evt){
    if(isPlatformBrowser(this.platformId)){
      var text_documento = $('#'+evt.target.id).val();

      for(var a=0; a<this.pasajero_asientos.length; a++){
        var camp_txtdocumento = $("#txtdocumento_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val();
        
        if(camp_txtdocumento == text_documento){
          if($("#dni_datos_infante_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val() == ""){
            $("#relacion_edad_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val("Apoderado");
          }
        }else if(text_documento != camp_txtdocumento && $("#relacion_edad_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val() == "Apoderado"){
          $("#relacion_edad_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val("Adulto");
        }else if(camp_txtdocumento == ""){
          $("#relacion_edad_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val("Adulto");
        }
      }
    }
  }

  searchNameDocumentoInfante(evt){
    if(isPlatformBrowser(this.platformId)){
      var text_documento = $('#'+evt.target.id).val();
      if(String(text_documento).length > 7){
        //var part_text = String(evt.target.id).split("_");
        var id_tipo_doc = $("#selectTipDocInfante").val();

        var txtidpasajero = "idpasajeroInfante";
        var txtflagws = "flagwsInfante";
        var id_text_nombres = "txtnombresInfante";
        var id_text_apellidos = "txtapellidosInfante";
        var id_fecha_nacimiento = "fecha_nacimiento_infante";

        $('#'+txtidpasajero).val(String(''));
        $('#'+txtflagws).val(String(''));
        $('#'+id_text_nombres).val(String(''));
        $('#'+id_text_apellidos).val(String(''));
        $('#'+id_fecha_nacimiento).val(String(''));

        if(!String(text_documento).includes(" ")){
          $(".loader").fadeIn("slow");
          this.taskService.getNameDocumento(Number(id_tipo_doc), String(text_documento)).subscribe(response => {
            //console.log(response);

            if(response != null){
              $('#'+txtidpasajero).val(String(response['idpasajero']));
              $('#'+txtflagws).val(String(response['flagWS']));
              $('#'+id_text_nombres).val(String(response['nombre']));
              $('#'+id_text_apellidos).val(String(response['apePaterno'])+" "+String(response['apeMaterno']));
              var fecha = "";
              if(String(response['fechanacimiento']).includes("/")){
                var partFecha = String(response['fechanacimiento']).split("/");
                fecha = partFecha[2]+"-"+partFecha[1]+"-"+partFecha[0];
              }
              
              $('#'+id_fecha_nacimiento).val(String(fecha));
              //this.aceptar_fecha_nacimiento(part_text[1]+"_"+part_text[2]);

              //? Quitar el bloqueo de cambiar nombre de infante
              //$("#"+id_text_nombres).prop("readonly", true);
              //$("#"+id_text_apellidos).prop("readonly", true);

              if(id_tipo_doc == 1 && String(text_documento).length>8){
                $('#'+evt.target.id).val("");
                $('#'+txtidpasajero).val("");
                $('#'+txtflagws).val("");
                $('#'+id_text_nombres).val("");
                $('#'+id_text_apellidos).val("");
                $("#"+id_text_nombres).prop("readonly", true);
                $("#"+id_text_apellidos).prop("readonly", true);
                $('#'+id_fecha_nacimiento).val("");
              }
            }else{
              $('#'+txtidpasajero).val(String(''));
              $('#'+txtflagws).val(String(''));
              $('#'+id_text_nombres).val(String(''));
              $('#'+id_text_apellidos).val(String(''));
              $('#'+id_fecha_nacimiento).val(String(''));

              $("#"+id_text_nombres).prop("readonly", false);
              $("#"+id_text_apellidos).prop("readonly", false);

              if(id_tipo_doc == 1){
                var valoresAceptados = /^[0-9]+$/;
                if (String(text_documento).match(valoresAceptados)){
                  $("#"+id_text_nombres).prop("readonly", false);
                  $("#"+id_text_apellidos).prop("readonly", false);
                } else {
                  $("#"+id_text_nombres).prop("readonly", true);
                  $("#"+id_text_apellidos).prop("readonly", true);
                }
              }

              if(id_tipo_doc == 1 && String(text_documento).length>8){
                $('#'+evt.target.id).val("");
                $('#'+txtidpasajero).val("");
                $('#'+txtflagws).val("");
                $('#'+id_text_nombres).val("");
                $('#'+id_text_apellidos).val("");
                $("#"+id_text_nombres).prop("readonly", true);
                $("#"+id_text_apellidos).prop("readonly", true);
                $('#'+id_fecha_nacimiento).val("");
              }
            }

            $(".loader").fadeOut("slow");
          });
        }else{
          this.mostrar_modal("modal_mensaje_sin_espacios");

          $('#'+txtidpasajero).val(String(''));
          $('#'+txtflagws).val(String(''));
          $('#'+id_text_nombres).val(String(''));
          $('#'+id_text_apellidos).val(String(''));

          $("#"+id_text_nombres).prop("readonly", true);
          $("#"+id_text_apellidos).prop("readonly", true);
        }
      }
    }
  }

  abrirModalDatosInfante(id: string){
    $("#idapoderadoInfante").val(id);
    $("#txtdocumentoInfante").val("");
    $("#txtnombresInfante").val("");
    $("#txtapellidosInfante").val("");
    $("#fecha_nacimiento_infante").val(this.date_hoy);
    this.mostrar_modal('modalAgregarInfante');
  }

  editarDatosInfante(id: string){
    this.mostrar_modal('modalAgregarInfante');

    for(var a=0; a<this.lista_infante_detalle.length; a++){
      if(this.lista_infante_detalle[a]['id'] == id){
        $("#selectTipDocInfante").val(this.lista_infante_detalle[a]['selectTipDocInfante']);
        $("#idapoderadoInfante").val(this.lista_infante_detalle[a]['id']);
        $("#txtdocumentoInfante").val(this.lista_infante_detalle[a]['txtdocumentoInfante']);
        $("#txtnombresInfante").val(this.lista_infante_detalle[a]['txtnombresInfante']);
        $("#txtapellidosInfante").val(this.lista_infante_detalle[a]['txtapellidosInfante']);
        $("#fecha_nacimiento_infante").val(this.convert_format_fecha_guion(this.lista_infante_detalle[a]['fecha_nacimiento_infante']));
      }
    }
  }

  eliminarDatosInfante(id: string){
    $('#btn_agregar_infante_'+id).css('display', 'inline');
    $('#btn_verdatos_infante_'+id).css('display', 'none');
    $('#btn_editar_infante_'+id).css('display', 'none');
    $('#btn_eliminar_infante_'+id).css('display', 'none');
    $("font#fontPalabraApoderado2").html("DNI Apoderado:");

    this.lista_infante_detalle.splice(this.lista_infante_detalle.findIndex(v => v.id === id), 1);

    $("#dni_datos_infante_"+id).val("");
  }

  guardarDatosInfante(){
    var id = $("#idapoderadoInfante").val();
    this.verificar_edad_infante();

    if(this.errorDatosInfante == 0){
      var val = 0;
      if($("#txtdocumentoInfante").val() == ""){
        val = 1;
      }
      if($("#txtnombresInfante").val() == ""){
        val = 1;
      }
      if($("#txtapellidosInfante").val() == ""){
        val = 1;
      }
      if(this.change_format_fecha($("#fecha_nacimiento_infante").val()) == ""){
        val = 1;
      }

      if(val == 0){
        $('#dni_datos_infante_'+id).val($("#txtdocumentoInfante").val());

        this.ocultar_modal('modalAgregarInfante');

        $('#btn_agregar_infante_'+id).css('display', 'none');
        $('#btn_verdatos_infante_'+id).css('display', 'inline');
        $('#btn_editar_infante_'+id).css('display', 'inline');
        $('#btn_eliminar_infante_'+id).css('display', 'inline');

        this.datos_infante_detalle = {
          "id": id,
          "selectTipDocInfante": Number($("#selectTipDocInfante").val()),
          "selectTipVinculo": $("#selectTipVinculo").val(),
          "txtdocumentoInfante": $("#txtdocumentoInfante").val(),
          "txtnombresInfante": $("#txtnombresInfante").val(),
          "txtapellidosInfante": $("#txtapellidosInfante").val(),
          "fecha_nacimiento_infante": this.change_format_fecha($("#fecha_nacimiento_infante").val()),
          "idpasajeroInfante": $("#idpasajeroInfante").val(),
          "flagwsInfante": $("#flagwsInfante").val()
        };

        if(this.lista_infante_detalle == false){
          this.lista_infante_detalle.push(this.datos_infante_detalle);
        }else{
          for(var ab=0; ab<this.lista_infante_detalle.length; ab++){
            if(this.lista_infante_detalle[ab]['id'] == id){
              this.lista_infante_detalle[ab]['selectTipDocInfante'] = Number($("#selectTipDocInfante").val());
              this.lista_infante_detalle[ab]['selectTipVinculo'] = $("#selectTipVinculo").val();
              this.lista_infante_detalle[ab]['txtdocumentoInfante'] = $("#txtdocumentoInfante").val();
              this.lista_infante_detalle[ab]['txtnombresInfante'] = $("#txtnombresInfante").val();
              this.lista_infante_detalle[ab]['txtapellidosInfante'] = $("#txtapellidosInfante").val();
              this.lista_infante_detalle[ab]['fecha_nacimiento_infante'] = this.change_format_fecha($("#fecha_nacimiento_infante").val());
              this.lista_infante_detalle[ab]['idpasajeroInfante'] = $("#idpasajeroInfante").val();
              this.lista_infante_detalle[ab]['flagwsInfante'] = $("#flagwsInfante").val();
            }
          }
        }

        $("#idapoderadoInfante").val("");
        $("#txtdocumentoInfante").val("");
        $("#txtnombresInfante").val("");
        $("#txtapellidosInfante").val("");
        $("#fecha_nacimiento_infante").val("");
        $("#idpasajeroInfante").val("");
        $("#flagwsInfante").val("");
        
        if($("#selectTipVinculo").val() == "Padre"){
          $("font#fontPalabraApoderado2").html("DNI Padre:");
        }else if($("#selectTipVinculo").val() == "Apoderado"){
          $("font#fontPalabraApoderado2").html("DNI Apoderado:");
        }
      }else{
        this.notificacion_mensajes_alerta("Error", "No puede haber campos vacíos.");
      }
    }else if(this.errorDatosInfante == 1){
      this.notificacion_mensajes_alerta("Error", "El pasajero colocado no corresponde a un infante.");
    }
  }

  verificar_edad_infante(){
    var fechaNacimiento = $("#fecha_nacimiento_infante").val();
    
    /****************************************************************************/
    var hoy = new Date();
    var cumpleanos = new Date(String(fechaNacimiento));
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if(m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())){
      edad--;
    }

    if(edad>=0 && edad<6){
      this.errorDatosInfante = 0;
    }else{
      this.errorDatosInfante = 1;
      this.notificacion_mensajes_alerta("Error", "La edad colocada no corresponde a un infante.");
    }
    /****************************************************************************/
  }

  change_detalle_infante(evt, id: string){
    if(isPlatformBrowser(this.platformId)){
      if(evt.target.checked == true){
        $('#datos_infante_'+id).css('display', 'inline');
      }else{
        $('#datos_infante_'+id).css('display', 'none');
        $('#datos_detalle_infante1_'+id).removeClass('mostrar_ocultar');
        $('#datos_detalle_infante2_'+id).removeClass('mostrar_ocultar');
      }
    }
  }

  change_detalle_infante_apoderado(evt, id: string){
    if(isPlatformBrowser(this.platformId)){
      if(evt.target.checked == true){
        $('#datos_adolescente_'+id).css('display', 'inline');
      }else{
        $('#datos_adolescente_'+id).css('display', 'none');
        $('#pregunta1_detalle_adolescente_'+id).removeClass('mostrar_ocultar');
      }
    }
  }

  maxLengthDocumento(event: any){
    if(isPlatformBrowser(this.platformId)){
      var texto = event.target.value;
      var part_id = event.target.id.split("_");
      var val_tip_document = Number($("#selectTipDoc_"+part_id[1]+"_"+part_id[2]+" option:selected" ).val());

      if(String($("#txtdocumento_"+part_id[1]+"_"+part_id[2]).val()).includes(" ")){
        return false;
      }

      if(val_tip_document == 1){                  //DNI
        if(String($("#txtdocumento_"+part_id[1]+"_"+part_id[2]).val()).trim().length > 8){
          $("#txtdocumento_"+part_id[1]+"_"+part_id[2]).val("");
        }

        if(texto.trim().length > 7){
          return false;
        }else{
          return true;
        }
      }else if(val_tip_document == 8){            //CARNET DE EXTRANJERIA
        if(texto.trim().length > 11){
          return false;
        }else{
          return true;
        }
      }else if(val_tip_document == 7){            //CEDULA DE IDENTIDAD
        if(String($("#txtdocumento_"+part_id[1]+"_"+part_id[2]).val()).trim().length > 10){
          $("#txtdocumento_"+part_id[1]+"_"+part_id[2]).val("");
        }

        if(texto.trim().length > 9){
          return false;
        }else{
          return true;
        }
      }else if(val_tip_document == 6){            //PASAPORTE
        if(texto.trim().length > 11){
          return false;
        }else{
          return true;
        }
      }
    }

    return false;
  }

  maxLengthDocumentoInfante(event: any){
    if(isPlatformBrowser(this.platformId)){
      var texto = event.target.value;
      var val_tip_document = Number($("#selectTipDocInfante option:selected" ).val());

      if(String($("#txtdocumentoInfante").val()).includes(" ")){
        return false;
      }

      if(val_tip_document == 1){                  //DNI
        if(String($("#txtdocumentoInfante").val()).trim().length > 8){
          $("#txtdocumentoInfante").val("");
        }

        if(texto.trim().length > 7){
          return false;
        }else{
          return true;
        }
      }else if(val_tip_document == 8){            //CARNET DE EXTRANJERIA
        if(texto.trim().length > 11){
          return false;
        }else{
          return true;
        }
      }else if(val_tip_document == 7){            //CEDULA DE IDENTIDAD
        if(String($("#txtdocumentoInfante").val()).trim().length > 10){
          $("#txtdocumentoInfante").val("");
        }

        if(texto.trim().length > 9){
          return false;
        }else{
          return true;
        }
      }else if(val_tip_document == 6){            //PASAPORTE
        if(texto.trim().length > 11){
          return false;
        }else{
          return true;
        }
      }
    }

    return false;
  }

  deleteBlankDataRuc(evt){
    if(isPlatformBrowser(this.platformId)){
      var text_documento = $('#'+evt.target.id).val();
      var texto_reemplazar = "";

      if(String(text_documento).includes(" ")){
        texto_reemplazar = String(text_documento).replace(" ", "");
        $('#'+evt.target.id).val(texto_reemplazar);
      }

      if(String(text_documento).includes("a")){
        texto_reemplazar = String(text_documento).replace("a", "");
        $('#'+evt.target.id).val(texto_reemplazar);
      }
    }
  }

  deleteBlankDataDocumento(evt){
    if(isPlatformBrowser(this.platformId)){
      var text_documento = $('#'+evt.target.id).val();
      var texto_reemplazar = "";
      var part_text = String(evt.target.id).split("_");
      var id_tipo_doc = $("#selectTipDoc_"+part_text[1]+"_"+part_text[2]).val();

      if(id_tipo_doc == 1){
        if(String(text_documento).includes(" ")){
          texto_reemplazar = String(text_documento).replace(" ", "");
          $('#'+evt.target.id).val(texto_reemplazar);
        }
      }
    }
  }

  deleteBlankDataDocumentoInfante(evt){
    if(isPlatformBrowser(this.platformId)){
      var text_documento = $('#'+evt.target.id).val();
      var texto_reemplazar = "";
      var part_text = String(evt.target.id).split("_");
      var id_tipo_doc = $("#selectTipDocInfante_"+part_text[1]+"_"+part_text[2]).val();

      if(id_tipo_doc == 1){
        if(String(text_documento).includes(" ")){
          texto_reemplazar = String(text_documento).replace(" ", "");
          $('#'+evt.target.id).val(texto_reemplazar);
        }
      }
    }
  }

  changeSelect(evt){
    if(isPlatformBrowser(this.platformId)){
      var part_text = String(evt.target.id).split("_");

      $("#txtdocumento_"+part_text[1]+"_"+part_text[2]).val("");
      $("#txtnombres_"+part_text[1]+"_"+part_text[2]).val("");
      $("#txtapellidos_"+part_text[1]+"_"+part_text[2]).val("");
      $("#edad_"+part_text[1]+"_"+part_text[2]).val("");

      var select_document = $('#selectTipDoc_'+part_text[1]+"_"+part_text[2]).val();

      /**
      * @param CARNET_EXTRANJERIA 8
      * @param CEDULA_INDENTIDAD 7
      * @param DNI 1
      * @param PASAPORTE 6 
      */

      if(select_document == 8){
        $('#txtdocumento_'+part_text[1]+"_"+part_text[2]).get(0).type = 'text';
      }else if(select_document == 7){
        $('#txtdocumento_'+part_text[1]+"_"+part_text[2]).get(0).type = 'text';
      }else if(select_document == 1){
        $('#txtdocumento_'+part_text[1]+"_"+part_text[2]).get(0).type = 'number';
      }else if(select_document == 6){
        $('#txtdocumento_'+part_text[1]+"_"+part_text[2]).get(0).type = 'text';
      }
    }
  }

  changeSelectInfante(evt){
    if(isPlatformBrowser(this.platformId)){
      var part_text = String(evt.target.id).split("_");

      $("#txtdocumentoInfante_"+part_text[1]+"_"+part_text[2]).val("");
      $("#txtnombresInfante_"+part_text[1]+"_"+part_text[2]).val("");
      $("#txtapellidosInfante_"+part_text[1]+"_"+part_text[2]).val("");
      $("#edadInfante_"+part_text[1]+"_"+part_text[2]).val("");
    }
  }

  mostrar_modal(name_modal: string){
    if(isPlatformBrowser(this.platformId)){
      $('#'+name_modal).modal('show');
    }
  }

  ocultar_modal(name_modal: string){
    if(isPlatformBrowser(this.platformId)){
      $('#'+name_modal).modal('hide');
    }
  }

  change_format_fecha_barra(fecha: string){
    var part = fecha.split("-");
    var dia = String(part[2])
    var mes = String(part[1])
    var anio = String(part[0]);

    return dia+"/"+mes+"/"+anio;
  }

  onCountryChange(evt){
    this.code_pais = evt.dialCode;
  }

  reemplazar_caracteres(event: any){
    if(isPlatformBrowser(this.platformId)){
      var texto = String($('#numeroDatosContacto').val()).replace(/[^a-zA-Z0-9 ]/g,'');
      $('#numeroDatosContacto').val(Number(texto));

      
      if($('#numeroDatosContacto').val() == "0"){
        $('#numeroDatosContacto').val('');
      }
    }
  }

  limit_num_input(event: any){
    if(isPlatformBrowser(this.platformId)){
      //console.log(String($('#numeroDatosContacto').val()));
      if(String($('#numeroDatosContacto').val()).includes('/\+/g')){
        //console.log("entro");
        var texto = String($('#numeroDatosContacto').val()).replace('/\+/g','');
        $('#numeroDatosContacto').val(Number(texto));
      }

      if(event.target.value.length == 15){
        return false;
      }else{
        return true;
      }
    }
    return true;
  }

  limit_num_ruc(event: any){
    if(isPlatformBrowser(this.platformId)){
      if(event.target.value.length == 11){
        return false;
      }else{
        return true;
      }
    }
    return true;
  }

  change_detalle_cupon(evt){
    if(isPlatformBrowser(this.platformId)){
      if(evt.target.checked == true){
        $('#detalle_cupon').css('display', 'block');
      }else{
        $('#detalle_cupon').css('display', 'none');
      }
    }
  }

  change_detalle_factura(evt){
    if(isPlatformBrowser(this.platformId)){
      if(evt.target.checked == true){
        $('#detalle_factura').css('display', 'block');
        $('#rucSolicitaFactura').val('');
        $('#razonSolicitaFactura').val('');
        $('#direccionSolicitaFactura').val('');

        if($('#flexSwitchCheckDefault').is(":checked") == true && this.cuponActivo == 1){
          this.EliminarCuponAplicado();
          this.notificacion_mensajes("Warning", "No se puede aplicar el Cupón en una factura.");
        }
      }else{
        $('#detalle_factura').css('display', 'none');
      }
    }
  }

  verificarFechaViaje(nameCupon: string){
    if(nameCupon == "MOVILBUS20DTO"){
      if(Date.parse(this.fechaSalida) > Date.parse("2024-06-05") && Date.parse(this.fechaSalida) < Date.parse("2024-06-10")){
        return 1;
      }else{
        return 0;
      }
    }else{
      if(Date.parse(this.fechaSalida) > Date.parse("2024-06-05") && Date.parse(this.fechaSalida) < Date.parse("2024-06-10")){
        return 1;
      }else if(Date.parse(this.fechaSalida) > Date.parse("2024-07-15") && Date.parse(this.fechaSalida) < Date.parse("2024-08-07")){
        return 1;
      }else if(Date.parse(this.fechaSalida) > Date.parse("2024-08-28") && Date.parse(this.fechaSalida) < Date.parse("2024-09-02")){
        return 1;
      }else if(Date.parse(this.fechaSalida) > Date.parse("2024-10-03") && Date.parse(this.fechaSalida) < Date.parse("2024-10-09")){
        return 1;
      }else if(Date.parse(this.fechaSalida) > Date.parse("2024-10-31") && Date.parse(this.fechaSalida) < Date.parse("2024-11-04")){
        return 1;
      }else if(Date.parse(this.fechaSalida) > Date.parse("2024-12-05") && Date.parse(this.fechaSalida) < Date.parse("2024-12-11")){
        return 1;
      }else{
        return 0;
      }
    }
  }

  verificarRutas(ida_vuelta: number, nameCupon: string){
    var val = 1;
    
    var rutasBloqueadas;

    if(nameCupon != 'MOVILOVER25'){
      rutasBloqueadas = [304,274,310,294,266,269];
    }else{
      return 1;
    }

    if(ida_vuelta == 1){
      if(rutasBloqueadas.includes(Number(this.idRuta_ida))){
        val = 0;
      }else{
        val = 1;
      }
    }else if(ida_vuelta == 2){
      if(rutasBloqueadas.includes(Number(this.idRuta_vuelta))){
        val = 0;
      }else{
        val = 1;
      }
    }
    
    return val;
  }

  ConsultarCupon(){

  }

  EliminarCuponAplicado(){

  }

  verifyAsientosPromocion(IdaVuelta: number){
    var val = 0;

    //TODO: TIPO DE TARIFA
    /*
     * 1 : PROMO IMBATIBLE
     * 2 : PROMO ESPECIAL
     * 3 : REGULAR 140
     * 4 : CAMA 160
     * 5 : FULLFLAT 180
     * 6 : PRECIO65
     * 7 : ECOMINTERNO
     * 8 : CYBER DAY 
     * 9 : REGULAR 120
    */

    if(IdaVuelta == 1){                 //TODO: IDA
      if(this.num_asientos_ida.includes(",")){
        var part = this.num_asientos_ida.split(",");
        for(var a=0; a<part.length; a++){
          var part2 = part[a].split("-");

          var asiento = part2[0];
          var piso = part2[1];

          if(this.idServicioIda == 36 || this.idServicioIda == 31 || this.idServicioIda == 35 || this.idServicioIda == 1 || this.idServicioIda == 15 || this.idServicioIda == 22 || this.idServicioIda == 25 || this.idServicioIda == 44 || this.idServicioIda == 45){
            for(var b=0; b<this.estructura_bus_ida['listaAsiento'].length; b++){
              if(this.estructura_bus_ida['listaAsiento'][b]['piso'] == Number(piso) && this.estructura_bus_ida['listaAsiento'][b]['asiento'] == Number(asiento)){
                if(this.estructura_bus_ida['listaAsiento'][b]['tipoTarifa'] == 3 || this.estructura_bus_ida['listaAsiento'][b]['tipoTarifa'] == 4 || this.estructura_bus_ida['listaAsiento'][b]['tipoTarifa'] == 9){
                  // no llena nada
                }else{
                  val++;
                }
              }
            }
          }else if(this.idServicioIda == 34 || this.idServicioIda == 27 || this.idServicioIda == 21){
            for(var b=0; b<this.estructura_bus_ida['listaAsiento'].length; b++){
              if(this.estructura_bus_ida['listaAsiento'][b]['piso'] == Number(piso) && this.estructura_bus_ida['listaAsiento'][b]['asiento'] == Number(asiento)){
                if(this.estructura_bus_ida['listaAsiento'][b]['tipoTarifa'] == 4 || this.estructura_bus_ida['listaAsiento'][b]['tipoTarifa'] == 3 || this.estructura_bus_ida['listaAsiento'][b]['tipoTarifa'] == 9){
                  // no llena nada
                }else{
                  val++;
                }
              }
            }
          }else if(this.idServicioIda == 29 || this.idServicioIda == 37 || this.idServicioIda == 30 || this.idServicioIda == 32 || this.idServicioIda == 2 || this.idServicioIda == 3 || this.idServicioIda == 39){
            for(var b=0; b<this.estructura_bus_ida['listaAsiento'].length; b++){
              if(this.estructura_bus_ida['listaAsiento'][b]['piso'] == Number(piso) && this.estructura_bus_ida['listaAsiento'][b]['asiento'] == Number(asiento)){
                if(this.estructura_bus_ida['listaAsiento'][b]['tipoTarifa'] == 4 || this.estructura_bus_ida['listaAsiento'][b]['tipoTarifa'] == 3 || this.estructura_bus_ida['listaAsiento'][b]['tipoTarifa'] == 9){
                  // no llena nada
                }else{
                  val++;
                }
              }
            }
          }
        }
      }else{
        var part2 = this.num_asientos_ida.split("-");

        var asiento = part2[0];
        var piso = part2[1];

        if(this.idServicioIda == 36 || this.idServicioIda == 31 || this.idServicioIda == 35 || this.idServicioIda == 1 || this.idServicioIda == 15 || this.idServicioIda == 22 || this.idServicioIda == 25 || this.idServicioIda == 44 || this.idServicioIda == 45){
          for(var b=0; b<this.estructura_bus_ida['listaAsiento'].length; b++){
            if(this.estructura_bus_ida['listaAsiento'][b]['piso'] == Number(piso) && this.estructura_bus_ida['listaAsiento'][b]['asiento'] == Number(asiento)){
              if(this.estructura_bus_ida['listaAsiento'][b]['tipoTarifa'] == 3 || this.estructura_bus_ida['listaAsiento'][b]['tipoTarifa'] == 4 || this.estructura_bus_ida['listaAsiento'][b]['tipoTarifa'] == 9){
                // no llena nada
              }else{
                val++;
              }
            }
          }
        }else if(this.idServicioIda == 34 || this.idServicioIda == 27 || this.idServicioIda == 21){
          for(var b=0; b<this.estructura_bus_ida['listaAsiento'].length; b++){
            if(this.estructura_bus_ida['listaAsiento'][b]['piso'] == Number(piso) && this.estructura_bus_ida['listaAsiento'][b]['asiento'] == Number(asiento)){
              if(this.estructura_bus_ida['listaAsiento'][b]['tipoTarifa'] == 4 || this.estructura_bus_ida['listaAsiento'][b]['tipoTarifa'] == 3 || this.estructura_bus_ida['listaAsiento'][b]['tipoTarifa'] == 9){
                // no llena nada
              }else{
                val++;
              }
            }
          }
        }else if(this.idServicioIda == 29 || this.idServicioIda == 37 || this.idServicioIda == 30 || this.idServicioIda == 32 || this.idServicioIda == 2 || this.idServicioIda == 3 || this.idServicioIda == 39){
          for(var b=0; b<this.estructura_bus_ida['listaAsiento'].length; b++){
            if(this.estructura_bus_ida['listaAsiento'][b]['piso'] == Number(piso) && this.estructura_bus_ida['listaAsiento'][b]['asiento'] == Number(asiento)){
              if(this.estructura_bus_ida['listaAsiento'][b]['tipoTarifa'] == 4 || this.estructura_bus_ida['listaAsiento'][b]['tipoTarifa'] == 3 || this.estructura_bus_ida['listaAsiento'][b]['tipoTarifa'] == 9){
                // no llena nada
              }else{
                val++;
              }
            }
          }
        }
      }
    }else if(IdaVuelta == 2){           //TODO: VUELTA
      if(this.num_asientos_vuelta != ""){
        if(this.num_asientos_vuelta.includes(",")){
          var part = this.num_asientos_vuelta.split(",");
          for(var a=0; a<part.length; a++){
            var part2 = part[a].split("-");

            var asiento = part2[0];
            var piso = part2[1];

            if(this.idServicioVuelta == 36 || this.idServicioVuelta == 31 || this.idServicioVuelta == 35 || this.idServicioVuelta == 1 || this.idServicioVuelta == 15 || this.idServicioVuelta == 22 || this.idServicioVuelta == 25 || this.idServicioVuelta == 44 || this.idServicioVuelta == 45){
              for(var b=0; b<this.estructura_bus_vuelta['listaAsiento'].length; b++){
                if(this.estructura_bus_vuelta['listaAsiento'][b]['piso'] == Number(piso) && this.estructura_bus_vuelta['listaAsiento'][b]['asiento'] == Number(asiento)){
                  if(this.estructura_bus_vuelta['listaAsiento'][b]['tipoTarifa'] == 3 || this.estructura_bus_vuelta['listaAsiento'][b]['tipoTarifa'] == 4 || this.estructura_bus_vuelta['listaAsiento'][b]['tipoTarifa'] == 9){
                    // no llena nada
                  }else{
                    val++;
                  }
                }
              }
            }else if(this.idServicioVuelta == 34 || this.idServicioVuelta == 27 || this.idServicioVuelta == 21){
              for(var b=0; b<this.estructura_bus_vuelta['listaAsiento'].length; b++){
                if(this.estructura_bus_vuelta['listaAsiento'][b]['piso'] == Number(piso) && this.estructura_bus_vuelta['listaAsiento'][b]['asiento'] == Number(asiento)){
                  if(this.estructura_bus_vuelta['listaAsiento'][b]['tipoTarifa'] == 4 || this.estructura_bus_vuelta['listaAsiento'][b]['tipoTarifa'] == 3 || this.estructura_bus_vuelta['listaAsiento'][b]['tipoTarifa'] == 9){
                    // no llena nada
                  }else{
                    val++;
                  }
                }
              }
            }else if(this.idServicioVuelta == 29 || this.idServicioVuelta == 37 || this.idServicioVuelta == 30 || this.idServicioVuelta == 32 || this.idServicioVuelta == 2 || this.idServicioVuelta == 3 || this.idServicioVuelta == 39){
              for(var b=0; b<this.estructura_bus_vuelta['listaAsiento'].length; b++){
                if(this.estructura_bus_vuelta['listaAsiento'][b]['piso'] == Number(piso) && this.estructura_bus_vuelta['listaAsiento'][b]['asiento'] == Number(asiento)){
                  if(this.estructura_bus_vuelta['listaAsiento'][b]['tipoTarifa'] == 4 || this.estructura_bus_vuelta['listaAsiento'][b]['tipoTarifa'] == 3 || this.estructura_bus_vuelta['listaAsiento'][b]['tipoTarifa'] == 9){
                    // no llena nada
                  }else{
                    val++;
                  }
                }
              }
            }
          }
        }else{
          var part2 = this.num_asientos_vuelta.split("-");

          var asiento = part2[0];
          var piso = part2[1];

          if(this.idServicioVuelta == 36 || this.idServicioVuelta == 31 || this.idServicioVuelta == 35 || this.idServicioVuelta == 1 || this.idServicioVuelta == 15 || this.idServicioVuelta == 22 || this.idServicioVuelta == 25 || this.idServicioVuelta == 44 || this.idServicioVuelta == 45){
            for(var b=0; b<this.estructura_bus_vuelta['listaAsiento'].length; b++){
              if(this.estructura_bus_vuelta['listaAsiento'][b]['piso'] == Number(piso) && this.estructura_bus_vuelta['listaAsiento'][b]['asiento'] == Number(asiento)){
                if(this.estructura_bus_vuelta['listaAsiento'][b]['tipoTarifa'] == 3 || this.estructura_bus_vuelta['listaAsiento'][b]['tipoTarifa'] == 4 || this.estructura_bus_vuelta['listaAsiento'][b]['tipoTarifa'] == 9){
                  // no llena nada
                }else{
                  val++;
                }
              }
            }
          }else if(this.idServicioVuelta == 34 || this.idServicioVuelta == 27 || this.idServicioVuelta == 21){
            for(var b=0; b<this.estructura_bus_vuelta['listaAsiento'].length; b++){
              if(this.estructura_bus_vuelta['listaAsiento'][b]['piso'] == Number(piso) && this.estructura_bus_vuelta['listaAsiento'][b]['asiento'] == Number(asiento)){
                if(this.estructura_bus_vuelta['listaAsiento'][b]['tipoTarifa'] == 4 || this.estructura_bus_vuelta['listaAsiento'][b]['tipoTarifa'] == 3 || this.estructura_bus_vuelta['listaAsiento'][b]['tipoTarifa'] == 9){
                  // no llena nada
                }else{
                  val++;
                }
              }
            }
          }else if(this.idServicioVuelta == 29 || this.idServicioVuelta == 37 || this.idServicioVuelta == 30 || this.idServicioVuelta == 32 || this.idServicioVuelta == 2 || this.idServicioVuelta == 3 || this.idServicioVuelta == 39){
            for(var b=0; b<this.estructura_bus_vuelta['listaAsiento'].length; b++){
              if(this.estructura_bus_vuelta['listaAsiento'][b]['piso'] == Number(piso) && this.estructura_bus_vuelta['listaAsiento'][b]['asiento'] == Number(asiento)){
                if(this.estructura_bus_vuelta['listaAsiento'][b]['tipoTarifa'] == 4 || this.estructura_bus_vuelta['listaAsiento'][b]['tipoTarifa'] == 3 || this.estructura_bus_vuelta['listaAsiento'][b]['tipoTarifa'] == 9){
                  // no llena nada
                }else{
                  val++;
                }
              }
            }
          }
        }
      }
    }

    if(val==0 && this.num_asientos_vuelta == "" && IdaVuelta==2){
      val++;
    }

    if(val>0){
      val = 0;
    }else{
      val = 1;
    }

    return val;
  }

  convert_format_fecha_guion(fecha: string){
    if(fecha != "" && fecha != null){
      var part_fecha = fecha.split("/");
      var new_fecha = part_fecha[2]+"-"+part_fecha[1]+"-"+part_fecha[0];
      //              AÑO            -  MES            -  DIA
      return new_fecha;
    }else{
      return "";
    }
  }

  convert_nom_fecha(fecha: string){
    if(isPlatformBrowser(this.platformId)){
      if(fecha != ""){
        let dias = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
        let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

        let date = new Date(fecha.replace(/-+/g, '/'));

        var fechaNum = date.getDate();
        var mes_name = date.getMonth();
        
        return dias[date.getDay()] + " " + fechaNum + " de " + meses[mes_name];
      }else{
        return "";
      }
    }

    return "";
  }

  notificacion_mensajes_alerta(titulo: string, mensaje: string){
    this.tituloMensajeAlerta = titulo;
    this.textoMensajeAlerta = mensaje;

    this.mostrar_modal("modal_mensajealerta");
  }

  notificacion_mensajes(tipo: string, message: string){
    if(tipo == "Success"){
      $.toast({
        heading: '<b>Éxito</b>',
        text: "<b>"+message+"</b>",
        icon: 'success',
        loader: true,
        loaderBg: '#9EC600',
        showHideTransition: 'fade',        //fade,slide,plain
        hideAfter: 6500,
        allowToastClose: false,            //true,false
        position: 'bottom-left' 
      });
    }else if(tipo == "Information"){
      $.toast({
        heading: '<b>Información</b>',
        text: "<b>"+message+"</b>",
        icon: 'info',
        loader: true,
        loaderBg: '#9EC600',
        showHideTransition: 'fade',        //fade,slide,plain
        hideAfter: 6500,
        allowToastClose: false,            //true,false
        position: 'bottom-left' 
      });
    }else if(tipo == "Warning"){
      $.toast({
        heading: '<b>Advertencia</b>',
        text: "<b>"+message+"</b>",
        icon: 'warning',
        bgColor: '#d1952d',
        loader: true,
        loaderBg: '#9EC600',
        showHideTransition: 'fade',        //fade,slide,plain
        hideAfter: 6500,
        allowToastClose: false,            //true,false
        position: 'bottom-left' 
      });
    }else if(tipo == "Error"){
      $.toast({
        heading: '<b>Error</b>',
        text: "<b>"+message+"</b>",
        icon: 'error',
        loader: true,
        loaderBg: '#9EC600',
        showHideTransition: 'fade',        //fade,slide,plain
        hideAfter: 6500,
        allowToastClose: false,            //true,false
        position: 'bottom-left' 
      });
    }
  }

  change_format_fecha(fecha: string){
    var part = fecha.split("-");
    var dia = String(part[2])
    var mes = String(part[1])
    var anio = String(part[0]);

    return dia+"/"+mes+"/"+anio;
  }

  convert_format_fecha_barra(fecha: string){
    if(isPlatformBrowser(this.platformId)){
      if(fecha != ""){
        var part_fecha = fecha.split("-");
        var new_fecha = part_fecha[2]+"/"+part_fecha[1]+"/"+part_fecha[0];
        //              DIA            -  MES            -  AÑO
        return new_fecha;
      }else{
        return "";
      }
    }
    return "";
  }

  seleccionarPromocionTarjeta(datTarjeta: any){
    if(this.PromocionTarjetaActiva['div'] != datTarjeta['div']){
      this.PromocionTarjetaActiva = datTarjeta;

      this.quitarPromocionTarjeta();
      this.aplicarPromocionTarjeta(datTarjeta);
    }
  }

  aplicarPromocionTarjeta(tarjetaActiva: any){
    //console.log(tarjetaActiva);
    //console.log(this.pasajero_asientos);

    this.cantidadFinalPromocionIda = 0;
    this.cantidadFinalPromocionVuelta = 0;

    this.promocionActiva = 1;
    this.tarcreId = tarjetaActiva['tarcreId'];

    if(tarjetaActiva['idaVuelta'] == 1){            //TODO: SOLO IDA
      this.NombreTarjeta = tarjetaActiva['nombreTarjeta'];
      var porcentajeRestantePromocionVentaIda = 100 - Number(tarjetaActiva['descuento']);

      var cantidadFinalPromocion = 0;
      if(Number(tarjetaActiva['stock']) >= this.pasajero_asientos.length){
        cantidadFinalPromocion = this.pasajero_asientos.length;
      }else if(Number(tarjetaActiva['stock']) <= this.pasajero_asientos.length){
        cantidadFinalPromocion = Number(tarjetaActiva['stock']);
      }else{
        cantidadFinalPromocion = this.pasajero_asientos.length;
      }

      //console.log(cantidadFinalPromocion);
      //console.log(porcentajeRestantePromocionVentaIda);

      for(var a=0; a<cantidadFinalPromocion; a++){
        this.promocionVentasIdIda = Number(tarjetaActiva['promocionId']);
        this.pasajero_asientos[a]['porcentaje_descuento_ida'] = Number(tarjetaActiva['descuento']);
        this.precio_pasajeros_asientos_ida -= Number(this.pasajero_asientos[a]['precio_ida']) - Math.trunc(Number(this.pasajero_asientos[a]['precio_ida'])*porcentajeRestantePromocionVentaIda/100);
      }

      this.cantidadFinalPromocionIda = cantidadFinalPromocion;
    }else if(tarjetaActiva['idaVuelta'] == 2){      //TODO: SOLO VUELTA
      this.NombreTarjeta = tarjetaActiva['nombreTarjeta'];
      var porcentajeRestantePromocionVentaVuelta = 100 - Number(tarjetaActiva['descuento']);

      var cantidadFinalPromocion = 0;
      if(Number(tarjetaActiva['stock']) >= this.pasajero_asientos.length){
        cantidadFinalPromocion = this.pasajero_asientos.length;
      }else if(Number(tarjetaActiva['stock']) <= this.pasajero_asientos.length){
        cantidadFinalPromocion = Number(tarjetaActiva['stock']);
      }else{
        cantidadFinalPromocion = this.pasajero_asientos.length;
      }

      for(var a=0; a<cantidadFinalPromocion; a++){
        this.promocionVentasIdVuelta = Number(tarjetaActiva['promocionId']);
        this.pasajero_asientos[a]['porcentaje_descuento_vuelta'] = Number(tarjetaActiva['descuento']);
        this.precio_pasajeros_asientos_vuelta -= Number(this.pasajero_asientos[a]['precio_vuelta']) - Math.trunc(Number(this.pasajero_asientos[a]['precio_vuelta'])*porcentajeRestantePromocionVentaVuelta/100);
      }

      this.cantidadFinalPromocionVuelta = cantidadFinalPromocion;
    }else if(tarjetaActiva['idaVuelta'] == 3){      //TODO: IDA Y VUELTA
      this.NombreTarjeta = tarjetaActiva['nombreTarjeta'];
      var partPromocionId = tarjetaActiva['promocionId'].split(",");
      var partDescuento = tarjetaActiva['descuento'].split(",");
      var partStock = tarjetaActiva['stock'].split(",");
      var porcentajeRestantePromocionVentaIda = 100 - Number(partDescuento[0]);
      var porcentajeRestantePromocionVentaVuelta = 100 - Number(partDescuento[1]);

      /*---------------------------------------------------- IDA ----------------------------------------------------*/
      var cantidadFinalPromocionIda = 0;
      if(Number(partStock[0]) >= this.pasajero_asientos.length){
        cantidadFinalPromocionIda = this.pasajero_asientos.length;
      }else if(Number(partStock[0]) <= this.pasajero_asientos.length){
        cantidadFinalPromocionIda = Number(partStock[0]);
      }else if(Number(partStock[0]) == this.pasajero_asientos.length){
        cantidadFinalPromocionIda = this.pasajero_asientos.length;
      }

      for(var a=0; a<cantidadFinalPromocionIda; a++){
        this.promocionVentasIdIda = Number(partPromocionId[0]);
        this.pasajero_asientos[a]['porcentaje_descuento_ida'] = Number(partDescuento[0]);
        this.precio_pasajeros_asientos_ida -= Number(this.pasajero_asientos[a]['precio_ida']) - Math.trunc(Number(this.pasajero_asientos[a]['precio_ida'])*porcentajeRestantePromocionVentaIda/100);
      }

      this.cantidadFinalPromocionIda = cantidadFinalPromocionIda;
      /*---------------------------------------------------- IDA ----------------------------------------------------*/

      /*---------------------------------------------------- VUELTA ----------------------------------------------------*/
      var cantidadFinalPromocionVuelta = 0;
      if(Number(partStock[1]) >= this.pasajero_asientos.length){
        cantidadFinalPromocionVuelta = this.pasajero_asientos.length;
      }else if(Number(partStock[1]) <= this.pasajero_asientos.length){
        cantidadFinalPromocionVuelta = Number(partStock[1]);
      }else if(Number(partStock[1]) == this.pasajero_asientos.length){
        cantidadFinalPromocionVuelta = this.pasajero_asientos.length;
      }

      for(var a=0; a<cantidadFinalPromocionVuelta; a++){
        this.promocionVentasIdVuelta = Number(partPromocionId[1]);
        this.pasajero_asientos[a]['porcentaje_descuento_vuelta'] = Number(partDescuento[1]);
        this.precio_pasajeros_asientos_vuelta -= Number(this.pasajero_asientos[a]['precio_vuelta']) - Math.trunc(Number(this.pasajero_asientos[a]['precio_vuelta'])*porcentajeRestantePromocionVentaVuelta/100);
      }

      this.cantidadFinalPromocionVuelta = cantidadFinalPromocionVuelta;
      /*---------------------------------------------------- VUELTA ----------------------------------------------------*/
    }

    this.precio_total_pasajeros_asientos = this.precio_pasajeros_asientos_ida + this.precio_pasajeros_asientos_vuelta;
    $('#'+tarjetaActiva['div']).addClass("card_tarjeta_seleccion");
  }

  quitarPromocionTarjeta(){
    this.cantidadFinalPromocionIda = 0;
    this.cantidadFinalPromocionVuelta = 0;

    this.promocionActiva = 0;
    this.promocionVentasIdIda = 0;
    this.promocionVentasIdVuelta = 0;
    
    this.precio_pasajeros_asientos_ida = this.precio_pasajeros_asientos_ida_original;
    this.precio_pasajeros_asientos_vuelta = this.precio_pasajeros_asientos_vuelta_original;
    this.precio_total_pasajeros_asientos = this.precio_total_pasajeros_asientos_original;

    this.NombreTarjeta = "";
    $('#div_tarjeta_interbank').removeClass("card_tarjeta_seleccion");
    $('#div_tarjeta_bbva').removeClass("card_tarjeta_seleccion");
    $('#div_tarjeta_bcp').removeClass("card_tarjeta_seleccion");
    $('#div_tarjeta_banco_nacion').removeClass("card_tarjeta_seleccion");
    $('#div_tarjeta_scotiabank').removeClass("card_tarjeta_seleccion");
    $('#div_tarjeta_cmr').removeClass("card_tarjeta_seleccion");
    
    this.tarcreId = 64;
  }

  btn_pago_regular(){
    this.pago_regular_promocion_tarjeta = 1;

    $('#btn_pago_tarjeta_promociones').removeClass("btn_pago_tarjeta_seleccionado");
    $('#muestra_pague_aquí_promociones').css('display', 'none');

    $('#muestra_pague_aquí').css('display', 'flex');
    $('#btn_pago_regular').addClass("btn_pago_tarjeta_seleccionado");

    /*$('#div_tarjeta_interbank').removeClass("card_tarjeta_seleccion");
    $('#div_tarjeta_bbva').removeClass("card_tarjeta_seleccion");
    $('#div_tarjeta_bcp').removeClass("card_tarjeta_seleccion");
    $('#div_tarjeta_banco_nacion').removeClass("card_tarjeta_seleccion");
    $('#div_tarjeta_scotiabank').removeClass("card_tarjeta_seleccion");
    $('#div_tarjeta_cmr').removeClass("card_tarjeta_seleccion");*/

    this.PromocionTarjetaActiva = {};
    this.quitarPromocionTarjeta();
  }

  btn_pago_tarjeta_promociones(){
    this.pago_regular_promocion_tarjeta = 2;

    $('#muestra_pague_aquí_promociones').css('display', 'inline-flex');
    $('#muestra_pague_aquí').css('display', 'flex');

    $('#btn_pago_regular').removeClass("btn_pago_tarjeta_seleccionado");
    $('#btn_pago_tarjeta_promociones').addClass("btn_pago_tarjeta_seleccionado");
  }

  /************************************************************************************************/    //@elujan ++
  /*if(this.responseGenerarPago['issuingBank'].includes(this.NombreTarjeta)){
    //TODO: CORRECTO ***************************
    console.log("CORRECTO");

  }else{
    //! INCORRECTO *****************************
    console.log("INCORRECTO");
    var data = {
      voucherNumber: this.responseGenerarPago['batchNumber']
    }

    this.taskService.getVoid(data).subscribe(responseVoid=> {
      console.log(responseVoid);
      localStorage.setItem("StorageErrorPos", JSON.stringify(responseVoid));
      this.pantalla_error();
    });
  }*/
  /************************************************************************************************/    //@elujan ++

  pagarPaymentPagoEfectivo(TipForPago: number){
    if(isPlatformBrowser(this.platformId)){
      if(this.simularPagos == 0){
        $(".loader").fadeIn("slow");
      
        setTimeout(() => {
          $('#btn_atras').css('display', 'none');
          //$("#vista_pagar").css("display", "none");
          
          $('#muestra_pague_aquí').css('display', 'none');
          $('#muestra_pague_aquí_promociones').css('display', 'none');
        }, 500);

        setTimeout(() => {
          $(".loader").fadeOut("slow");
          $("#vista_pagar_imagenes").css("display", "inline");

          localStorage.setItem("StorageErrorPos", JSON.stringify({}));
          
          //console.log(this.precio_total_pasajeros_asientos.toFixed());

          this.taskService.postGenerarPago(this.precio_total_pasajeros_asientos.toFixed()).subscribe(responseGenerarPago=> {
            //this.responseGenerarPago = responseGenerarPago;

            //* RECIBE RESPUESTA DEL PINPAD
            console.log(responseGenerarPago);
            if(responseGenerarPago['batchNumber']){
              // TODO: CORRECTO
              
              var jsonArray = {
                voucherClient: responseGenerarPago['voucherClient']
              }
        
              const blob = new Blob([JSON.stringify(jsonArray)], { type: 'application/octet-stream' });
              saveAs(blob, "4C608A6XX.json");

              setTimeout(() => {
                //saveAs(blob, "4C608A6XX.json");
                this.crearArrayPagarSispas(TipForPago, String(responseGenerarPago['batchNumber']));
              }, 1750);
            }else{
              // ! INCORRECTO

              if(this.pago_regular_promocion_tarjeta == 2){
                $('#muestra_pague_aquí_promociones').css('display', 'flex');
              }
              
              $('#muestra_pague_aquí').css('display', 'flex');
              $("#vista_pagar_imagenes").css("display", "none");
              $("#div_cancelar_venta").css("display", "flex");

              $(".loader").fadeOut("slow");
            }
          }, error =>{
            //! SI ES ERROR

            if(this.pago_regular_promocion_tarjeta == 2){
              $('#muestra_pague_aquí_promociones').css('display', 'flex');
            }

            $('#muestra_pague_aquí').css('display', 'flex');
            $("#vista_pagar_imagenes").css("display", "none");
            $("#div_cancelar_venta").css("display", "flex");

            $(".loader").fadeOut("slow");
          }, () =>{
            if(this.pago_regular_promocion_tarjeta == 2){
              $('#muestra_pague_aquí_promociones').css('display', 'flex');
            }

            $('#muestra_pague_aquí').css('display', 'flex');
            $("#vista_pagar_imagenes").css("display", "none");
            $("#div_cancelar_venta").css("display", "flex");
            
            $(".loader").fadeOut("slow");
          });
        }, 2500);
      }else{
        this.simularPago(TipForPago);
      }
    }
  }

  simularPago(TipForPago: number){
    if(isPlatformBrowser(this.platformId)){
      $(".loader").fadeIn("slow");

      $('#btn_atras').css('display', 'none');
      $("#vista_pagar").css("display", "none");

      $(".loader").fadeOut("slow");
      $("#vista_pagar_imagenes").css("display", "inline");
      
      this.crearArrayPagarSispas(TipForPago, "000000123456");
    }
  }

  private ocultarElementosPago(): void {
    $('#btn_atras').hide();
    $('#muestra_mensaje_1').hide();
    $('#muestra_mensaje_2').hide();
    $('#muestra_pague_aquí_promociones').hide();
    $('#muestra_precio_total').hide();
    $('#muestra_pague_aquí').hide();
    $('#div_cancelar_venta').hide();
  }
  
  private mostrarErrorPago(): void {
    if (this.pago_regular_promocion_tarjeta === 2) {
      $('#muestra_pague_aquí_promociones').css('display', 'flex');
    }
  
    $("#vista_pagar_imagenes").css("display", "none");
  
    $('#btn_atras').css('display', 'inline');
    $('#muestra_mensaje_1').css('display', 'block');
    $('#muestra_mensaje_2').css('display', 'flex');
    $('#muestra_precio_total').css('display', 'flex');
    $('#muestra_pague_aquí').css('display', 'flex');
    $('#div_cancelar_venta').css('display', 'flex');
  }

  /*pagarPaymentPagoEfectivo(TipForPago: number){
    if(isPlatformBrowser(this.platformId)){
      $(".loader").fadeIn("slow");
      
      setTimeout(() => {
        $('#btn_atras').css('display', 'none');
        //$("#vista_pagar").css("display", "none");
        
        $('#muestra_pague_aquí').css('display', 'none');
        $('#muestra_pague_aquí_promociones').css('display', 'none');
      }, 500);

      setTimeout(() => {
        $(".loader").fadeOut("slow");
        this.ocultarElementosPago();
        $("#vista_pagar_imagenes").css("display", "inline");

        localStorage.setItem("StorageErrorPos", JSON.stringify({}));

        this.taskService.postGenerarPago(this.precio_total_pasajeros_asientos.toFixed())
          .subscribe({
            next: responseGenerarPago => {
              console.log(responseGenerarPago);

              if (responseGenerarPago['responseCode'] === '00') {
                // Transacción aprobada
                const jsonArray = { voucherClient: responseGenerarPago['voucherClient'] };
                const blob = new Blob([JSON.stringify(jsonArray)], { type: 'application/octet-stream' });
                const nombreArchivo = `${responseGenerarPago['batchNumber'] || 'voucher'}_${Date.now()}.json`;
                saveAs(blob, nombreArchivo);

                this.crearArrayPagarSispas(TipForPago, String(responseGenerarPago['batchNumber']));
              } else {
                this.mostrarErrorPago();
              }
            },
            error: err => {
              localStorage.setItem("StorageErrorPos", JSON.stringify(err));
              this.mostrarErrorPago();
            },
            complete: () => $(".loader").fadeOut("slow")
          });
      }, 2500);
    }
  }

  ocultarElementosPago() {
    $('#btn_atras').hide();
    $('#muestra_mensaje_1').hide();
    $('#muestra_mensaje_2').hide();
    $('#muestra_pague_aquí_promociones').hide();
    $('#muestra_precio_total').hide();
    $('#muestra_pague_aquí').hide();
    $('#div_cancelar_venta').hide();
  }
  
  mostrarErrorPago() {
    if (this.pago_regular_promocion_tarjeta == 2) {
      $('#muestra_pague_aquí_promociones').css('display', 'flex');
    }

    $('#muestra_mensaje_1').css('display', 'inline');
    $('#muestra_mensaje_2').css('display', 'inline');
    $('#muestra_precio_total').css('display', 'flex');
    $('#muestra_pague_aquí').css('display', 'flex');
    $("#vista_pagar_imagenes").css("display", "none");
    $("#div_cancelar_venta").css("display", "flex");
    $(".loader").fadeOut("slow");
  }*/

  crearArrayPagarSispas(TipForPago: number, voucherNumber: string){
    $(".loader2").fadeIn("slow");
    
    //this.validarcampos = this.validarCampos(2);
    //if(this.validarcampos == true){

      /*************************************************** ARRAY FINAL ***************************************************/
      this.ventaIdaVuelta = [];
      this.arrayCliente = [];
      this.subArrayFinal = [];
      this.ArrayFinal = [];

      //var usosAlAPlicarIda = this.usosAlAPlicarIda;
      //var usosAlAPlicarVuelta = this.usosAlAPlicarVuelta;

      for(var a=0; a<this.pasajero_asientos.length; a++){
        var id_variable_pasajero = this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta;
        var part_apell = String($("#txtapellidos_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val()).split(" ");

        var tarifaIda = 0;
          var descuentoIda = 0;
          var impPagadoIda = 0;
          var tarifaVuelta = 0;
          var descuentoVuelta = 0;
          var impPagadoVuelta = 0;
          var namePromocionIda = "";
          var descuentoPromocionIda = "";
          var namePromocionVuelta = "";
          var descuentoPromocionVuelta = "";
          var promocionIdIda = 0;
          var promocionIdVuelta = 0;
          var promocionIdSispasIda = 0;
          var promocionIdSispasVuelta = 0;

          if(this.promocionActiva == 1){
            if(this.pasajero_asientos[a]['porcentaje_descuento_ida'] != 0){
              tarifaIda = Number(this.pasajero_asientos[a]['precio_ida']);
              impPagadoIda = Math.trunc(Number(this.pasajero_asientos[a]['precio_ida'])*(100 - Number(this.pasajero_asientos[a]['porcentaje_descuento_ida']))/100);
              descuentoIda = tarifaIda - impPagadoIda;
              //namePromocionIda = this.namePromocionVenta;
              //descuentoPromocionIda = this.porcentajeDescuentoPromocionVenta+" %";
              //promocionIdIda = this.promocionVentasIdIda;
              promocionIdSispasIda = this.promocionVentasIdIda;
            }else{
              tarifaIda = Number(this.pasajero_asientos[a]['precio_ida']);
              descuentoIda = 0;
              impPagadoIda = Number(this.pasajero_asientos[a]['precio_ida']);
            }
            
            if(this.ida_vuelta == 2){
              if(this.pasajero_asientos[a]['porcentaje_descuento_vuelta'] != 0){
                tarifaVuelta = Number(this.pasajero_asientos[a]['precio_vuelta']);
                impPagadoVuelta = Math.trunc(Number(this.pasajero_asientos[a]['precio_vuelta'])*(100 - Number(this.pasajero_asientos[a]['porcentaje_descuento_vuelta']))/100);
                descuentoVuelta = tarifaVuelta - impPagadoVuelta;
                //namePromocionVuelta = this.namePromocionVenta;
                //descuentoPromocionVuelta = this.porcentajeDescuentoPromocionVenta+" %";
                //promocionIdVuelta = this.promocionVentasIdVuelta;
                promocionIdSispasVuelta = this.promocionVentasIdVuelta;
              }else{
                tarifaVuelta = Number(this.pasajero_asientos[a]['precio_vuelta']);
                descuentoVuelta = 0;
                impPagadoVuelta = Number(this.pasajero_asientos[a]['precio_vuelta']);
              }
            }
          }else{
            tarifaIda = Number(this.pasajero_asientos[a]['precio_ida']);
            descuentoIda = 0;
            impPagadoIda = Number(this.pasajero_asientos[a]['precio_ida']);
            tarifaVuelta = Number(this.pasajero_asientos[a]['precio_vuelta']);
            descuentoVuelta = 0;
            impPagadoVuelta = Number(this.pasajero_asientos[a]['precio_vuelta']);
          }

        /*if(this.promocionVuelta == 1 && this.promocion_ida_vuelta == 1){
          tarifaVuelta = Number(this.pasajero_asientos[a]['precio_vuelta']);
          descuentoVuelta = 0;
          impPagadoVuelta = Number(this.pasajero_asientos[a]['precio_vuelta']);
          namePromocionVuelta = this.namePromocion;

          if(this.porcentajeDescPromocionVuelta != 0){
            descuentoPromocionVuelta = this.porcentajeDescPromocionVuelta+" %";
          }else{
            descuentoPromocionVuelta = "S/. "+this.montoDescuentoPromocionVuelta;
          }
        }

        if(this.promocionIda == 1 && this.promocion_ida_vuelta == 0){
          var tarifa_ida = 0;
          for(var ab=0; ab<this.estructura_bus_ida.listaAsiento.length; ab++){
            if(this.estructura_bus_ida.listaAsiento[ab].asiento == Number(this.pasajero_asientos[a]['asiento_ida']) && this.estructura_bus_ida.listaAsiento[ab].piso == Number(this.pasajero_asientos[a]['piso_ida'])){
              tarifa_ida = this.estructura_bus_ida.listaAsiento[ab].tarifaAsiento;
            }
          }

          tarifaIda = tarifa_ida;
          descuentoIda = tarifaIda - Number(this.pasajero_asientos[a]['precio_ida']);
          impPagadoIda = Number(this.pasajero_asientos[a]['precio_ida']);
          namePromocionIda = this.namePromocion;

          if(this.porcentajeDescPromocionIda != 0){
            descuentoPromocionIda = this.porcentajeDescPromocionIda+" %";
          }else{
            descuentoPromocionIda = "S/. "+this.porcentajeDescPromocionIda;
          }
        }*/

        //TODO: *********************************************** RELACION PADRES E HIJOS ***********************************************/
        var dniApoderado = "";
        var nombretipoPasajero = $("#relacion_edad_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val();
        var tipoPasajero = 0;
        var idParentesco = 0;

        if(nombretipoPasajero == "Adulto"){
          dniApoderado = "";
          tipoPasajero = 1;
          idParentesco = 1;

        }else if(nombretipoPasajero == "Menor"){
          var chk_vincular_apoderado = "flexSwitchCheckInfante2_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta;
          if($('#'+chk_vincular_apoderado).is(":checked") == true){
            dniApoderado = $("#TipDocApoderado_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val();
            tipoPasajero = 2;
            if(dniApoderado != ""){
              idParentesco = 5;
            }
          }else{
            dniApoderado = "";
            tipoPasajero = 2;
            idParentesco = 7;
          }
        }else if(nombretipoPasajero == "Apoderado"){
          dniApoderado = "";
          tipoPasajero = 1;
          idParentesco = 2;
        }
        //TODO: *********************************************** RELACION PADRES E HIJOS ***********************************************/
        let datosCabeceraStorage = JSON.parse(localStorage.getItem('StorageDatosPasajeros') || '{}');

        if(this.ida_vuelta == 1){
          this.ventaIdaVuelta = {
            "ventaIda" : {
              "idItinerario": datosCabeceraStorage['idItinerarioIda'],
              "idRuta": datosCabeceraStorage['idRutaIda'],
              "pasajero": {
                "idpasajero": Number($("#txtidpasajero_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val()),
                "idTipoDocumento": Number($("#selectTipDoc_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val()),
                "numDocumento": $("#txtdocumento_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val(),
                "nombre": $("#txtnombres_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val(),
                "apePaterno": part_apell[0],
                "apeMaterno": part_apell[1],
                "fechanacimiento": this.change_format_fecha($("#fecha_nacimiento_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val()),
                "flagWS": Number($("#txtflagws_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val())
              },
              "idServicio": datosCabeceraStorage['idServicioIda'],
              "nroAsiento": Number(this.pasajero_asientos[a]['asiento_ida']),
              "nroPiso": this.pasajero_asientos[a]['piso_ida'],
              "idAgenciaPartida": datosCabeceraStorage['idAgenciaEmbarqueIda'],
              "fechaPartida": this.convert_format_fecha_barra(datosCabeceraStorage['fechaEmbarqueIda']),
              "horaPartida": datosCabeceraStorage['horaEmbarqueIda'],
              "idAgenciaLlegada": datosCabeceraStorage['idAgenciaDesembarqueIda'],
              "fechaLlegada": this.convert_format_fecha_barra(datosCabeceraStorage['fechaDesembarqueIda']),
              "horaLlegada": datosCabeceraStorage['horaDesembarqueIda'],
              "tarifa": tarifaIda,
              "descuento": descuentoIda,
              "impPagado": impPagadoIda,
              "namePromocion": namePromocionIda,
              "descuentoPromocion": descuentoPromocionIda,
              "emailContacto": $("#emailDatosContacto").val(),
              "telefonoOpcional": String($("#numeroDatosContacto").val()),
              "infoAdicional": this.flag_recibir_noticias, 
              "idParentesco": idParentesco,
              "tipoPasajero": tipoPasajero,
              "dniApoderado": dniApoderado,
              "promocionIdSispas": promocionIdSispasIda
            },
            "ventaVuelta" : null
          };
        }else{
          this.ventaIdaVuelta = {
            "ventaIda" : {
              "idItinerario": datosCabeceraStorage['idItinerarioIda'],
              "idRuta": datosCabeceraStorage['idRutaIda'],
              "pasajero": {
                "idpasajero": Number($("#txtidpasajero_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val()),
                "idTipoDocumento": Number($("#selectTipDoc_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val()),
                "numDocumento": $("#txtdocumento_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val(),
                "nombre": $("#txtnombres_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val(),
                "apePaterno": part_apell[0],
                "apeMaterno": part_apell[1],
                "fechanacimiento": this.change_format_fecha($("#fecha_nacimiento_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val()),
                "flagWS": Number($("#txtflagws_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val())
              },
              "idServicio": datosCabeceraStorage['idServicioIda'],
              "nroAsiento": Number(this.pasajero_asientos[a]['asiento_ida']),
              "nroPiso": this.pasajero_asientos[a]['piso_ida'],
              "idAgenciaPartida": datosCabeceraStorage['idAgenciaEmbarqueIda'],
              "fechaPartida": this.convert_format_fecha_barra(datosCabeceraStorage['fechaEmbarqueIda']),
              "horaPartida": datosCabeceraStorage['horaEmbarqueIda'],
              "idAgenciaLlegada": datosCabeceraStorage['idAgenciaDesembarqueIda'],
              "fechaLlegada": this.convert_format_fecha_barra(datosCabeceraStorage['fechaDesembarqueIda']),
              "horaLlegada": datosCabeceraStorage['horaDesembarqueIda'],
              "tarifa": tarifaIda,
              "descuento": descuentoIda,
              "impPagado": impPagadoIda,
              "namePromocion": namePromocionIda,
              "descuentoPromocion": descuentoPromocionIda,
              "emailContacto": $("#emailDatosContacto").val(),
              "telefonoOpcional": String($("#numeroDatosContacto").val()),
              "infoAdicional": this.flag_recibir_noticias, 
              "idParentesco": idParentesco,
              "tipoPasajero": tipoPasajero,
              "dniApoderado": dniApoderado,
              "promocionIdSispas": promocionIdSispasIda
            },
            "ventaVuelta" : {
              "idItinerario": datosCabeceraStorage['idItinerarioVuelta'],
              "idRuta": datosCabeceraStorage['idRutaVuelta'],
              "pasajero": {
                "idpasajero": Number($("#txtidpasajero_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val()),
                "idTipoDocumento": Number($("#selectTipDoc_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val()),
                "numDocumento": $("#txtdocumento_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val(),
                "nombre": $("#txtnombres_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val(),
                "apePaterno": part_apell[0],
                "apeMaterno": part_apell[1],
                "fechanacimiento": this.change_format_fecha($("#fecha_nacimiento_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val()),
                "flagWS": Number($("#txtflagws_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val())
              },
              "idServicio": datosCabeceraStorage['idServicioVuelta'],
              "nroAsiento": Number(this.pasajero_asientos[a]['asiento_vuelta']),
              "nroPiso": this.pasajero_asientos[a]['piso_vuelta'],
              "idAgenciaPartida": datosCabeceraStorage['idAgenciaEmbarqueVuelta'],
              "fechaPartida": this.convert_format_fecha_barra(datosCabeceraStorage['fechaEmbarqueVuelta']),
              "horaPartida": datosCabeceraStorage['horaEmbarqueVuelta'],
              "idAgenciaLlegada": datosCabeceraStorage['idAgenciaDesembarqueVuelta'],
              "fechaLlegada": this.convert_format_fecha_barra(datosCabeceraStorage['fechaDesembarqueVuelta']),
              "horaLlegada": datosCabeceraStorage['horaDesembarqueVuelta'],
              "tarifa": tarifaVuelta,
              "descuento": descuentoVuelta,
              "impPagado": impPagadoVuelta,
              "namePromocion": namePromocionVuelta,
              "descuentoPromocion": descuentoPromocionVuelta,
              "emailContacto": $("#emailDatosContacto").val(),
              "telefonoOpcional": String($("#numeroDatosContacto").val()),
              "infoAdicional": this.flag_recibir_noticias, 
              "idParentesco": idParentesco,
              "tipoPasajero": tipoPasajero,
              "dniApoderado": dniApoderado,
              "promocionIdSispas": promocionIdSispasVuelta
            }
          };
        }

        this.subArrayFinal.push(this.ventaIdaVuelta);

        /********************************************** AGREGAR INFANTE **********************************************/
        for(var c=0; c<this.lista_infante_detalle.length; c++){
          if(this.lista_infante_detalle[c]['id'] == id_variable_pasajero){
            var part_apell_infante = String(this.lista_infante_detalle[c]['txtapellidosInfante']).split(" ");
            var dniApoderadoInfante = $("#txtdocumento_"+this.lista_infante_detalle[c]['id']).val();
            //var vinculoApoderado = this.lista_infante_detalle[c]['selectTipVinculo'];
            var idpasajeroInfante = this.lista_infante_detalle[c]['idpasajeroInfante'];
            var flagwsInfante = this.lista_infante_detalle[c]['flagwsInfante'];

            idParentesco = 4;
            tipoPasajero = 3;

            if(this.ida_vuelta == 1){
              this.ventaIdaVuelta = {
                "ventaIda" : {
                  "idItinerario": datosCabeceraStorage['idItinerarioIda'],
                  "idRuta": datosCabeceraStorage['idRutaIda'],
                  "pasajero": {
                    "idpasajero": idpasajeroInfante,
                    "idTipoDocumento": Number(this.lista_infante_detalle[c]['selectTipDocInfante']),
                    "numDocumento": this.lista_infante_detalle[c]['txtdocumentoInfante'],
                    "nombre": this.lista_infante_detalle[c]['txtnombresInfante'],
                    "apePaterno": part_apell_infante[0],
                    "apeMaterno": part_apell_infante[1],
                    "fechanacimiento": this.lista_infante_detalle[c]['fecha_nacimiento_infante'],
                    "flagWS": Number(flagwsInfante)
                  },
                  "idServicio": datosCabeceraStorage['idServicioIda'],
                  "nroAsiento": Number(this.pasajero_asientos[a]['asiento_ida']),
                  "nroPiso": this.pasajero_asientos[a]['piso_ida'],
                  "idAgenciaPartida": datosCabeceraStorage['idAgenciaEmbarqueIda'],
                  "fechaPartida": this.convert_format_fecha_barra(datosCabeceraStorage['fechaEmbarqueIda']),
                  "horaPartida": datosCabeceraStorage['horaEmbarqueIda'],
                  "idAgenciaLlegada": datosCabeceraStorage['idAgenciaDesembarqueIda'],
                  "fechaLlegada": this.convert_format_fecha_barra(datosCabeceraStorage['fechaDesembarqueIda']),
                  "horaLlegada": datosCabeceraStorage['horaDesembarqueIda'],
                  "tarifa": 0.0,
                  "descuento": 0.0,
                  "impPagado": 0.0,
                  "namePromocion": "",
                  "descuentoPromocion": "",
                  "emailContacto": $("#emailDatosContacto").val(),
                  "telefonoOpcional": String($("#numeroDatosContacto").val()),
                  "infoAdicional": this.flag_recibir_noticias,
                  "idParentesco": idParentesco,
                  "tipoPasajero": tipoPasajero,
                  "dniApoderado": dniApoderadoInfante
                },
                "ventaVuelta" : null
              };
            }else{
              this.ventaIdaVuelta = {
                "ventaIda" : {
                  "idItinerario": datosCabeceraStorage['idItinerarioIda'],
                  "idRuta": datosCabeceraStorage['idRutaIda'],
                  "pasajero": {
                    "idpasajero": idpasajeroInfante,
                    "idTipoDocumento": Number(this.lista_infante_detalle[c]['selectTipDocInfante']),
                    "numDocumento": this.lista_infante_detalle[c]['txtdocumentoInfante'],
                    "nombre": this.lista_infante_detalle[c]['txtnombresInfante'],
                    "apePaterno": part_apell_infante[0],
                    "apeMaterno": part_apell_infante[1],
                    "fechanacimiento": this.lista_infante_detalle[c]['fecha_nacimiento_infante'],
                    "flagWS": Number(flagwsInfante)
                  },
                  "idServicio": datosCabeceraStorage['idServicioIda'],
                  "nroAsiento": Number(this.pasajero_asientos[a]['asiento_ida']),
                  "nroPiso": this.pasajero_asientos[a]['piso_ida'],
                  "idAgenciaPartida": datosCabeceraStorage['idAgenciaEmbarqueIda'],
                  "fechaPartida": this.convert_format_fecha_barra(datosCabeceraStorage['fechaEmbarqueIda']),
                  "horaPartida": datosCabeceraStorage['horaEmbarqueIda'],
                  "idAgenciaLlegada": datosCabeceraStorage['idAgenciaDesembarqueIda'],
                  "fechaLlegada": this.convert_format_fecha_barra(datosCabeceraStorage['fechaDesembarqueIda']),
                  "horaLlegada": datosCabeceraStorage['horaDesembarqueIda'],
                  "tarifa": 0.0,
                  "descuento": 0.0,
                  "impPagado": 0.0,
                  "namePromocion": "",
                  "descuentoPromocion": "",
                  "emailContacto": $("#emailDatosContacto").val(),
                  "telefonoOpcional": String($("#numeroDatosContacto").val()),
                  "infoAdicional": this.flag_recibir_noticias,
                  "idParentesco": idParentesco,
                  "tipoPasajero": tipoPasajero,
                  "dniApoderado": dniApoderadoInfante
                },
                "ventaVuelta" : {
                  "idItinerario": datosCabeceraStorage['idItinerarioVuelta'],
                  "idRuta": datosCabeceraStorage['idRutaVuelta'],
                  "pasajero": {
                    "idpasajero": idpasajeroInfante,
                    "idTipoDocumento": Number(this.lista_infante_detalle[c]['selectTipDocInfante']),
                    "numDocumento": this.lista_infante_detalle[c]['txtdocumentoInfante'],
                    "nombre": this.lista_infante_detalle[c]['txtnombresInfante'],
                    "apePaterno": part_apell_infante[0],
                    "apeMaterno": part_apell_infante[1],
                    "fechanacimiento": this.lista_infante_detalle[c]['fecha_nacimiento_infante'],
                    "flagWS": Number(flagwsInfante)
                  },
                  "idServicio": datosCabeceraStorage['idServicioVuelta'],
                  "nroAsiento": Number(this.pasajero_asientos[a]['asiento_vuelta']),
                  "nroPiso": this.pasajero_asientos[a]['piso_vuelta'],
                  "idAgenciaPartida": datosCabeceraStorage['idAgenciaEmbarqueVuelta'],
                  "fechaPartida": this.convert_format_fecha_barra(datosCabeceraStorage['fechaEmbarqueVuelta']),
                  "horaPartida": datosCabeceraStorage['horaEmbarqueVuelta'],
                  "idAgenciaLlegada": datosCabeceraStorage['idAgenciaDesembarqueVuelta'],
                  "fechaLlegada": this.convert_format_fecha_barra(datosCabeceraStorage['fechaDesembarqueVuelta']),
                  "horaLlegada": datosCabeceraStorage['horaDesembarqueVuelta'],
                  "tarifa": 0.0,
                  "descuento": 0.0,
                  "impPagado": 0.0,
                  "namePromocion": "",
                  "descuentoPromocion": "",
                  "emailContacto": $("#emailDatosContacto").val(),
                  "telefonoOpcional": String($("#numeroDatosContacto").val()),
                  "infoAdicional": this.flag_recibir_noticias,
                  "idParentesco": idParentesco,
                  "tipoPasajero": tipoPasajero,
                  "dniApoderado": dniApoderadoInfante
                }
              };
            }
  
            this.subArrayFinal.push(this.ventaIdaVuelta);
          }
        }
        /********************************************** AGREGAR INFANTE **********************************************/
      }

      if($("#razonSolicitaFactura").val() != ""){
        this.arrayCliente = {
          "idcliente": Number($("#idclienteSolicitaFactura").val()),
          "nroDoc": $("#rucSolicitaFactura").val(),
          "razonSocial": $("#razonSolicitaFactura").val(),
          "direccion": $("#direccionSolicitaFactura").val(),
          "flag": Number($("#flagSolicitaFactura").val())
        };
      }else{
        this.arrayCliente = null;
      }

      this.ArrayFinal = {
        "ventaPasajeros": this.subArrayFinal,
        "tiempoPasarelaPago": this.tiempoPagoPasarelaWeb,
        "ipLocal": this.myIp,
        "cliente": this.arrayCliente,
        "idTipForPago": TipForPago,
        "montoTotal": this.precio_total_pasajeros_asientos,
        "codePaisPhone": "+"+this.code_pais,
        "numOperacion": voucherNumber,
        "idAgencia": this.codAgenciaOrigen,
        "idUsuarioSispas": this.idUsuarioSispas,
        "fechaLiquidacion": this.convert_format_fecha_barra(this.fechaLiquidacion),
        "tarcreId": this.tarcreId
      };

      //console.log(this.ArrayFinal);

      localStorage.setItem("StorageResumenCompra1", JSON.stringify(this.getDatosPasajeros));
      localStorage.setItem("StorageResumenCompra2", JSON.stringify(this.ArrayFinal));

      let ArrayMensajeDescuento: string[] = [];
      if(this.cantidadFinalPromocionIda > 0){ ArrayMensajeDescuento.push("Se aplicó el descuento de la promoción a "+this.cantidadFinalPromocionIda+" asientos de Ida."); }
      if(this.cantidadFinalPromocionVuelta > 0){ ArrayMensajeDescuento.push("- Se aplicó el descuento de la promoción a "+this.cantidadFinalPromocionVuelta+" asientos de Vuelta."); }
      localStorage.setItem("StorageResumenCompra3", JSON.stringify(ArrayMensajeDescuento));

      this.taskService.postGenerarVentaSispas(this.ArrayFinal).subscribe(responseGenerarVentaSispas=> {
        localStorage.setItem("StoragePDFImprimir", JSON.stringify(responseGenerarVentaSispas));

        $(".loader2").fadeOut("slow");
        $(".loader3").fadeOut("slow");
        this.resumen_compra();
      }, error =>{
        //! SI ES ERROR
        $(".loader").fadeOut("slow");
      }, () =>{
        $(".loader").fadeOut("slow");
      });
    //}
  }

  liberarVenta(){
    $(".loader2").fadeIn("slow");
    this.liberarAsientos();
    
    setTimeout(() => {
      $(".loader2").fadeOut("slow");
      this.router.navigate(['']);
    }, 2500);
  }

  liberarAsientos(){
    if(this.num_asientos_vuelta == ""){
      if(this.getDatosPasajeros['numAsientosIda'].includes(",")){
        var part_asi = this.getDatosPasajeros['numAsientosIda'].split(",");

        for(var a=0; a<part_asi.length; a++){
          var part_asi2 = String(part_asi[a]).split("-");
          let list_asientos: any = [];
          let list_pisos: any = [];

          list_asientos.push(Number(part_asi2[0]));
          list_pisos.push(Number(part_asi2[1])); 
        
          var part_fecha = this.getDatosPasajeros['fechaEmbarqueIda'].split("-");
          var fecha_partida = part_fecha[2]+"/"+part_fecha[1]+"/"+part_fecha[0];
  
          this.taskService.deleteLiberarAsiento(Number(this.getDatosPasajeros['idRutaIda']), Number(this.getDatosPasajeros['idItinerarioIda']), fecha_partida, list_asientos, this.getDatosPasajeros['horaEmbarqueIda'], list_pisos, 5, Number(this.getDatosPasajeros['precioAsientosIda'][a]), "").subscribe(response => {
            if(response['result'] == true){
              //console.log("Se desbloqueó el asiento.");
            }else{
              //console.log("No se desbloqueó el asiento.");
            }
          });
        }
      }else if(this.getDatosPasajeros['numAsientosIda']!="" && !this.getDatosPasajeros['numAsientosIda'].includes(",")){
        var part_asi = this.getDatosPasajeros['numAsientosIda'].split("-");
        var part_fecha = this.getDatosPasajeros['fechaEmbarqueIda'].split("-");
        var fecha_partida = part_fecha[2]+"/"+part_fecha[1]+"/"+part_fecha[0];

        let list_asientos: any = [];
        let list_pisos: any = [];

        list_asientos.push(Number(part_asi[0]));
        list_pisos.push(Number(part_asi[1])); 
  
        this.taskService.deleteLiberarAsiento(Number(this.getDatosPasajeros['idRutaIda']), Number(this.getDatosPasajeros['idItinerarioIda']), fecha_partida, list_asientos, this.getDatosPasajeros['horaEmbarqueIda'], list_pisos, 5, Number(this.getDatosPasajeros['precioAsientosIda']), "").subscribe(response => {
          if(response['result'] == true){
            //console.log("Se desbloqueó el asiento.");
          }else{
            //console.log("No se desbloqueó el asiento.");
          }
        });
      }
    }else{
      if(this.getDatosPasajeros['numAsientosVuelta'].includes(",")){
        var part_asi = this.getDatosPasajeros['numAsientosVuelta'].split(",");

        for(var a=0; a<part_asi.length; a++){
          var part_asi2 = String(part_asi[a]).split("-");
          let list_asientos: any = [];
          let list_pisos: any = [];

          list_asientos.push(Number(part_asi2[0]));
          list_pisos.push(Number(part_asi2[1])); 
        
          var part_fecha = this.getDatosPasajeros['fechaEmbarqueVuelta'].split("-");
          var fecha_partida = part_fecha[2]+"/"+part_fecha[1]+"/"+part_fecha[0];
  
          this.taskService.deleteLiberarAsiento(Number(this.getDatosPasajeros['idRutaVuelta']), Number(this.getDatosPasajeros['idItinerarioVuelta']), fecha_partida, list_asientos, this.getDatosPasajeros['horaEmbarqueVuelta'], list_pisos, 5, Number(this.getDatosPasajeros['precioAsientosVuelta'][a]), "").subscribe(response => {
            if(response['result'] == true){
              //console.log("Se desbloqueó el asiento.");
            }else{
              //console.log("No se desbloqueó el asiento.");
            }
          });
        }
      }else if(this.getDatosPasajeros['numAsientosVuelta']!="" && !this.getDatosPasajeros['numAsientosVuelta'].includes(",")){
        var part_asi = this.getDatosPasajeros['numAsientosVuelta'].split("-");
        var part_fecha = this.getDatosPasajeros['fechaEmbarqueVuelta'].split("-");
        var fecha_partida = part_fecha[2]+"/"+part_fecha[1]+"/"+part_fecha[0];

        let list_asientos: any = [];
        let list_pisos: any = [];

        list_asientos.push(Number(part_asi[0]));
        list_pisos.push(Number(part_asi[1])); 
  
        this.taskService.deleteLiberarAsiento(Number(this.getDatosPasajeros['idRutaVuelta']), Number(this.getDatosPasajeros['idItinerarioVuelta']), fecha_partida, list_asientos, this.getDatosPasajeros['horaEmbarqueVuelta'], list_pisos, 5, Number(this.getDatosPasajeros['precioAsientosVuelta']), "").subscribe(response => {
          if(response['result'] == true){
            //console.log("Se desbloqueó el asiento.");
          }else{
            //console.log("No se desbloqueó el asiento.");
          }
        });
      }
    }
  }

  pantalla_error(){
    this.router.navigate(['pantalla-error']);
  }

  resumen_compra(){
    this.router.navigate(['resumen-compra']);
  }

  cambiar_radiobutton(textoRadioButton: string){
    $('#chk_dni').removeClass("document_select");
    $('#chk_carnet_extranjeria').removeClass("document_select");
    $('#chk_pasaporte').removeClass("document_select");
    $('#chk_cedula_identidad').removeClass("document_select");

    if(textoRadioButton == "dni"){
      this.limite_maximo_numero_documento = 8;
      this.tipo_entrada_teclado = "NUMERICO";
      this.numero_documento = "";
      $('#chk_dni').addClass("document_select");
      this.id_tipo_documento = 1;
      this.nombreTipDoc = "DNI";
    }else if(textoRadioButton == "carnet_extranjeria"){
      this.limite_maximo_numero_documento = 12;
      this.tipo_entrada_teclado = "ALFANUMERICO";
      this.numero_documento = "";
      $('#chk_carnet_extranjeria').addClass("document_select");
      this.id_tipo_documento = 8;
      this.nombreTipDoc = "CARNET EXTRANJERIA";
    }else if(textoRadioButton == "pasaporte"){
      this.limite_maximo_numero_documento = 12;
      this.tipo_entrada_teclado = "ALFANUMERICO";
      this.numero_documento = "";
      $('#chk_pasaporte').addClass("document_select");
      this.id_tipo_documento = 6;
      this.nombreTipDoc = "PASAPORTE";
    }else if(textoRadioButton == "cedula_identidad"){
      this.limite_maximo_numero_documento = 10;
      this.tipo_entrada_teclado = "ALFANUMERICO";
      this.numero_documento = "";
      $('#chk_cedula_identidad').addClass("document_select");
      this.id_tipo_documento = 7;
      this.nombreTipDoc = "CEDULA IDENTIDAD";
    }
  }

  click_boton(letra_numero: string){
    if(letra_numero == "borrar"){
      if(this.numero_documento != ""){
        this.numero_documento = this.numero_documento.substring(0, this.numero_documento.length - 1);
        this.texto_mensaje_alerta = "";
      }
    }else{
      if(this.numero_documento.length >= this.limite_maximo_numero_documento){
        this.texto_mensaje_alerta = "* El documento ingresado debe tener la longitud del tipo de documento seleccionado.";
      }else{
        this.numero_documento = this.numero_documento+letra_numero;
      }
    }

    if(this.numero_documento.length >= 8){
      this.val_buscar_pasajero = 1
      $('#btn_buscar_pasajero').removeClass("btn_buscar_pasajero_disable");
      $('#btn_buscar_pasajero').addClass("btn_buscar_pasajero");
    }else{
      this.val_buscar_pasajero = 0;
      $('#btn_buscar_pasajero').removeClass("btn_buscar_pasajero");
      $('#btn_buscar_pasajero').addClass("btn_buscar_pasajero_disable");
    }
  }

  continuar_pasajero(){
    if(this.cont_posicion_pasajero < this.pasajero_asientos.length){
      this.cont_posicion_pasajero++;
      $("#vista_mostrar_datos_pasajeros").css("display", "none");
      $("#vista_ingresar_datos_pasajeros").css("display", "inline");
      $("#btn_buscar_pasajero").css("display", "inline");
      $("#view_datos_pasajero_"+this.id_anterior).css("display", "none");
      this.numero_documento = "";
    }else if(this.cont_posicion_pasajero == this.pasajero_asientos.length){
      $("#vista_mostrar_datos_pasajeros").css("display", "none");
      $("#view_datos_pasajero_"+this.id_anterior).css("display", "none");

      $("#vista_mostrar_tipo_de_compra").css("display", "inline");
    }
  }

  buscar_pasajero(){
    var text_documento = this.numero_documento;
    //console.log(this.cont_posicion_pasajero);
    var posicion_pasajero = this.cont_posicion_pasajero - 1;
    
    var id = "";

    if(this.getDatosPasajeros['numAsientosIda'].includes(",")){
      var part1 = this.getDatosPasajeros['numAsientosIda'].split(",");
      var part_text1 = part1[posicion_pasajero].split("-");
      
      if(this.getDatosPasajeros['numAsientosVuelta'] == ""){
        id = part_text1[0]+"_";
      }else{
        var part2 = this.getDatosPasajeros['numAsientosVuelta'].split(",");
        var part_text2 = part2[posicion_pasajero].split("-");

        id = part_text1[0]+"_"+part_text2[0];
      }
    }else{
      var part_text1 = this.getDatosPasajeros['numAsientosIda'].split("-");
      
      if(this.getDatosPasajeros['numAsientosVuelta'] == ""){
        id = part_text1[0]+"_";
      }else{
        var part_text2 = this.getDatosPasajeros['numAsientosVuelta'].split("-");

        id = part_text1[0]+"_"+part_text2[0];
      }
    }
    
    if(String(text_documento).length > 7){
      var id_tipo_doc = "selectTipDoc_"+id;
      var nombreTipDoc ="nombreTipDoc_"+id;
      var txtdocumento = "txtdocumento_"+id;
      var txtidpasajero = "txtidpasajero_"+id;
      var txtflagws = "txtflagws_"+id;
      var id_text_nombres = "txtnombres_"+id;
      var id_text_apellidos = "txtapellidos_"+id;
      var id_fecha_nacimiento = "fecha_nacimiento_"+id;
      var chck_femenino = "inlineRadio_"+id+"_1";
      var chck_masculino = "inlineRadio_"+id+"_2";

      $('#'+txtidpasajero).val(String(''));
      $('#'+txtflagws).val(String(''));
      $('#'+id_text_nombres).val(String(''));
      $('#'+id_text_apellidos).val(String(''));
      $('#'+id_fecha_nacimiento).val(String(''));
      $('#'+chck_femenino).prop("checked", false);
      $('#'+chck_masculino).prop("checked", false);

      if(this.pasajero_asientos.length == 1){
        $('#emailDatosContacto').val('');
        $('#numeroDatosContacto').val('');
      }

      if(!String(text_documento).includes(" ")){
        $(".loader").fadeIn("slow");
        this.taskService.getNameDocumento(this.id_tipo_documento, String(text_documento)).subscribe(response => {
          //console.log(response);
          if(response != null){

            $('#'+id_tipo_doc).val(this.id_tipo_documento);
            $('#'+nombreTipDoc).val(this.nombreTipDoc);
            $('#'+txtdocumento).val(String(response['numDocumento']));
            $('#'+txtidpasajero).val(String(response['idpasajero']));
            $('#'+txtflagws).val(String(response['flagWS']));
            $('#'+id_text_nombres).val(String(response['nombre']));
            $('#'+id_text_apellidos).val(String(response['apePaterno'])+" "+String(response['apeMaterno']));
            var fecha = "";
            if(String(response['fechanacimiento']).includes("/")){
              var partFecha = String(response['fechanacimiento']).split("/");
              fecha = partFecha[2]+"-"+partFecha[1]+"-"+partFecha[0];
            }
            
            $('#'+id_fecha_nacimiento).val(String(fecha));
            this.aceptar_fecha_nacimiento(id);

            if(response['genero'] == 1){    /* MUJER */
              $("#inlineRadio_"+id+"_1").prop('checked', true);
              $("#inlineRadio_"+id+"_2").prop('checked', false);
            }else if(response['genero'] == 2){    /* HOMBRE */
              $("#inlineRadio_"+id+"_1").prop('checked', false);
              $("#inlineRadio_"+id+"_2").prop('checked', true);
            }

            $("#"+id_text_nombres).prop("readonly", true);
            $("#"+id_text_apellidos).prop("readonly", true);

            if(Number(response['sexo']) == 1){
              $('#'+chck_femenino).prop("checked", true);
            }else if(Number(response['sexo']) == 2){
              $('#'+chck_masculino).prop("checked", true);
            }

            if(response['email'] != null){
              $('#emailDatosContacto').val(String(response['email']));
            }
            if(response['telefono'] != null){
              $('#numeroDatosContacto').val(String(response['telefono']));
            }

            if(this.id_tipo_documento == 1 && String(text_documento).length>8){
              $('#'+id).val("");
              $('#'+txtidpasajero).val("");
              $('#'+txtflagws).val("");
              $('#'+id_text_nombres).val("");
              $('#'+id_text_apellidos).val("");
              $("#"+id_text_nombres).prop("readonly", true);
              $("#"+id_text_apellidos).prop("readonly", true);
              $('#'+id_fecha_nacimiento).val("");
            }

            this.cont_pasajero_nuevo = 1;
          }else{
            $('#'+txtdocumento).val(String(text_documento));
            $('#'+txtflagws).val(String(''));
            $('#'+id_text_nombres).val(String(''));
            $('#'+id_text_apellidos).val(String(''));
            $('#'+id_fecha_nacimiento).val(String(''));

            $('#'+id_tipo_doc).prop("disabled", false);
            $('#'+txtdocumento).prop("readonly", false);
            $("#"+id_text_nombres).prop("readonly", false);
            $("#"+id_text_apellidos).prop("readonly", false);
            $('#'+id_fecha_nacimiento).prop("readonly", false);

            this.cont_pasajero_nuevo = 0;

            $("#div_mensaje_pasajero_nuevo").css("display", "inline");

            /*if(this.id_tipo_documento == 1){
              var valoresAceptados = /^[0-9]+$/;
              if (String(text_documento).match(valoresAceptados)){
                $("#"+id_text_nombres).prop("readonly", false);
                $("#"+id_text_apellidos).prop("readonly", false);
              } else {
                $("#"+id_text_nombres).prop("readonly", true);
                $("#"+id_text_apellidos).prop("readonly", true);
              }
            }

            if(this.id_tipo_documento == 1 && String(text_documento).length>8){
              $('#'+id).val("");
              $('#'+txtidpasajero).val("");
              $('#'+txtflagws).val("");
              $('#'+id_text_nombres).val("");
              $('#'+id_text_apellidos).val("");
              $("#"+id_text_nombres).prop("readonly", true);
              $("#"+id_text_apellidos).prop("readonly", true);
              $('#'+id_fecha_nacimiento).val("");
            }*/
          }

          $("#vista_ingresar_datos_pasajeros").css("display", "none");
          $("#vista_mostrar_datos_pasajeros").css("display", "inline");
          this.id_anterior = id;
          $("#view_datos_pasajero_"+id).css("display", "inline");

          //$("#btn_atras").css("display", "none");
          $("#btn_buscar_pasajero").css("display", "none");

          $(".loader").fadeOut("slow");
        });
      }else{
        this.mostrar_modal("modal_mensaje_sin_espacios");

        $('#'+txtidpasajero).val(String(''));
        $('#'+txtflagws).val(String(''));
        $('#'+id_text_nombres).val(String(''));
        $('#'+id_text_apellidos).val(String(''));

        $("#"+id_text_nombres).prop("readonly", true);
        $("#"+id_text_apellidos).prop("readonly", true);
      }
    }else{
      if(text_documento == ""){
        var part_text = String(id).split("_");
        this.aceptar_fecha_nacimiento(id);
      }
    }
  }

  select_prev_boleta_factura(texto: string){
    $('#btn_btn_boleto').removeClass("select_btn_btn_boleto_factura");
    $('#btn_btn_factura').removeClass("select_btn_btn_boleto_factura");
    $("#icon_btn_boleto").css("display", "none");
    $("#icon_btn_factura").css("display", "none");
    $("#icon_btn_boleto_no_select").css("display", "inline");
    $("#icon_btn_factura_no_select").css("display", "inline");
    
    if(texto == "FACTURA"){
      $('#btn_btn_factura').addClass("select_btn_btn_boleto_factura");
      $("#icon_btn_factura").css("display", "inline");
      $("#icon_btn_factura_no_select").css("display", "none");
    }else if(texto == "BOLETA"){
      $('#btn_btn_boleto').addClass("select_btn_btn_boleto_factura");
      $("#icon_btn_boleto").css("display", "inline");
      $("#icon_btn_boleto_no_select").css("display", "none");
    }

    this.texto_boleta_factura = texto;
    this.div_seleccionado = "vista_mostrar_tipo_de_compra";

    $("#div_mensaje_alerta_boleta_factura").css("display", "flex");
    $('#emailDatosContacto').removeClass("input_incorrecto");
    $('#numeroDatosContacto').removeClass("input_incorrecto");

    if(this.texto_boleta_factura == ""){
      this.mensaje_alerta_boleta_factura = "Seleccione una Boleta o Factura.";
    }else if(!$('#emailDatosContacto').val().includes("@")){
      this.mensaje_alerta_boleta_factura = "Ingrese un correo válido.";
      $('#emailDatosContacto').addClass("input_incorrecto");
    }else if($('#numeroDatosContacto').val().length < 9){
      this.mensaje_alerta_boleta_factura = "Ingrese un número de teléfono válido.";
      $('#numeroDatosContacto').addClass("input_incorrecto");
    }else{
      $('#emailDatosContacto').addClass("input_correcto");
      $('#numeroDatosContacto').addClass("input_correcto");
      $("#btn_siguiente_boleta_factura").css("display", "inline");
      $("#div_mensaje_alerta_boleta_factura").css("display", "none");
    }
  }

  /*seleccionar_boleta_factura(texto: string){
    $(".loader").fadeIn("slow");
    this.nombre_tipo_de_compra = "Tipo de compra: "+texto

    if(texto == "FACTURA"){
      $("#form_seleccionar_boleta_factura").css("display", "none");
      $("#form_ingresar_factura").css("display", "inline");
      $("#btn_buscar_ruc").css("display", "inline");
      this.copiarDatosFin();
      $(".loader").fadeOut("slow");
    }else if(texto == "BOLETA"){
      $("#vista_mostrar_tipo_de_compra").css("display", "none");
      $("#btn_buscar_ruc").css("display", "none");
      $("#vista_mostrar_resumen_compra").css("display", "inline");
      $("#btn_atras").css("display", "none");
      this.copiarDatosFin();
      $(".loader").fadeOut("slow");
    }
  }*/

  copiarDatosFin(){
    for(var a=0; a<this.pasajero_asientos.length; a++){
      var id = this.pasajero_asientos[a]['asiento_ida']+"_"+this.pasajero_asientos[a]['asiento_vuelta'];

      $("#fin_tip_doc_"+id).html($("#nombreTipDoc_"+id).val());
      $("#fin_num_doc_"+id).html($("#txtdocumento_"+id).val());
      $("#fin_nombre_"+id).html($("#txtapellidos_"+id).val() + ", " + $("#txtnombres_"+id).val());

      if($("#asiento_vuelta_"+id).val() != ""){
        $("#fin_asiento_"+id).val($("#asiento_ida_"+id).val()+", "+$("#asiento_vuelta_"+id).val());
      }else{
        $("#fin_asiento_"+id).val($("#asiento_ida_"+id).val());
      }
    }
  }

  click_boton_ruc(numero: string){
    if(numero == "borrar"){
      if(this.numero_ruc != ""){
        this.numero_ruc = this.numero_ruc.substring(0, this.numero_ruc.length - 1);
        this.texto_mensaje_alerta_ruc = "";
      }
    }else{
      if(this.numero_ruc.length > this.limite_maximo_numero_ruc){
        this.texto_mensaje_alerta_ruc = "* El RUC ingresado debe tener la longitud de 11 dígitos.";
      }else{
        this.numero_ruc = this.numero_ruc+numero;
      }
    }

    if(this.numero_ruc.length == 11){
      $('#btn_buscar_ruc').removeClass("btn_buscar_ruc_disable");
      $('#btn_buscar_ruc').addClass("btn_buscar_ruc");
    }else{
      $('#btn_buscar_ruc').removeClass("btn_buscar_ruc");
      $('#btn_buscar_ruc').addClass("btn_buscar_ruc_disable");
    }
  }

  buscar_ruc(){
    this.val_factura_new = 0;
    $(".loader").fadeIn("slow");
    $("#form_ingresar_factura").css("display", "none");
    $("#btn_buscar_ruc").css("display", "none");
    $("#form_mostrar_datos_factura").css("display", "inline");
      
    if(this.cuponActivo == 1){
      this.EliminarCuponAplicado();
      this.notificacion_mensajes_alerta("Advertencia", "No se puede aplicar el Cupón en una factura.");
    }

    if(String(this.numero_ruc).length > 10){
      $(".loader").fadeIn("slow");
      this.taskService.getDatosRuc(Number(this.numero_ruc)).subscribe(response => {
        //console.log(response);
        if(response != null){
          $("#idclienteSolicitaFactura").val(response['idcliente']);
          $("#flagSolicitaFactura").val(response['flag']);
          $("#rucSolicitaFactura").val(response['nroDoc']);
          $("#razonSolicitaFactura").val(response['razonSocial']);
          $("#direccionSolicitaFactura").val(response['direccion']);

          $("#rucSolicitaFactura").prop("readonly", true);
          $("#razonSolicitaFactura").prop("readonly", true);
          $("#direccionSolicitaFactura").prop("readonly", true);
          $("#btn_editar_ruc").css("display", "inline");
          $("#btn_editar_ruc").css("display", "inline");
          $("#btn_continuar_ruc").css("display", "inline");

          this.val_factura_new = 1;
        }else{
          if(this.validarRUC(this.numero_ruc) == true){
            $("#idclienteSolicitaFactura").val("");
            $("#flagSolicitaFactura").val("");
            $("#rucSolicitaFactura").val("");
            $("#razonSolicitaFactura").val("");
            $("#direccionSolicitaFactura").val("");

            $("#rucSolicitaFactura").prop("readonly", false);
            $("#razonSolicitaFactura").prop("readonly", false);
            $("#direccionSolicitaFactura").prop("readonly", false);
          }else{
            $("#idclienteSolicitaFactura").val("");
            $("#flagSolicitaFactura").val("");
            $("#rucSolicitaFactura").val("");
            $("#razonSolicitaFactura").val("");
            $("#direccionSolicitaFactura").val("");

            $("#rucSolicitaFactura").prop("readonly", false);
            $("#razonSolicitaFactura").prop("readonly", false);
            $("#direccionSolicitaFactura").prop("readonly", false);
          }

          this.val_factura_new = 0;
        }
        $(".loader").fadeOut("slow");
      });
    }else{
      $("#rucSolicitaFactura").val("");
      $("#razonSolicitaFactura").val("");
      $("#direccionSolicitaFactura").val("");
      $("#rucSolicitaFactura").prop("readonly", true);
      $("#razonSolicitaFactura").prop("readonly", true);
      $("#direccionSolicitaFactura").prop("readonly", true);
    }

    //$("#btn_atras").css("display", "none");
    $(".loader").fadeOut("slow");
  }

  continuar_ruc(){
    $("#vista_mostrar_tipo_de_compra").css("display", "none");
    $("#vista_mostrar_resumen_compra").css("display", "inline");
    $("#btn_atras").css("display", "inline");

    if(this.texto_boleta_factura == "FACTURA"){
      $("#fin_num_ruc").html($("#rucSolicitaFactura").val());
      $("#fin_razon_social_ruc").html($("#razonSolicitaFactura").val());
      $("#fin_direccion_ruc").html($("#direccionSolicitaFactura").val());
    }
  }

  editar_ruc(){
    $('#rucSolicitaFactura').prop("readonly", false);
    $('#razonSolicitaFactura').prop("readonly", false);
    $('#direccionSolicitaFactura').prop("readonly", false);

    //$("#btn_editar_ruc").css("display", "none");
    $("#rucSolicitaFactura").focus();
    this.activar_teclado_alfanumerico("rucSolicitaFactura", "form_mostrar_datos_factura", "alfanumerico");

    this.div_seleccionado = "form_mostrar_datos_factura";
  }

  editar_pasajero(id: string){
    $('#selectTipDoc_'+id).prop("disabled", false);
    $('#txtdocumento_'+id).prop("readonly", false);
    $('#txtnombres_'+id).prop("readonly", false);
    $('#txtapellidos_'+id).prop("readonly", false);
    $('#fecha_nacimiento_'+id).prop("readonly", false);

    $("#btn_editar_pasajero").css("display", "none");
    $("#txtdocumento_"+id).focus();
    this.activar_teclado_alfanumerico("txtdocumento_"+id, "vista_mostrar_datos_pasajeros", "alfanumerico");
  }

  siguiente_boleta_factura(){
    $(".loader").fadeIn("slow");
    this.nombre_tipo_de_compra = "Tipo de compra: "+this.texto_boleta_factura;

    if(this.div_seleccionado == "vista_mostrar_tipo_de_compra"){
      if(this.texto_boleta_factura == "FACTURA"){
        $("#form_seleccionar_boleta_factura").css("display", "none");
        $("#form_ingresar_factura").css("display", "inline");
        $("#btn_buscar_ruc").css("display", "inline");
        $("#btn_atras").css("display", "inline");
        $("#btn_siguiente_boleta_factura").css("display", "none");
        this.copiarDatosFin();
        this.div_seleccionado = "form_mostrar_datos_factura";
        $(".loader").fadeOut("slow");
      }else if(this.texto_boleta_factura == "BOLETA"){
        $("#vista_mostrar_tipo_de_compra").css("display", "none");
        $("#btn_buscar_ruc").css("display", "none");
        $("#vista_mostrar_resumen_compra").css("display", "inline");
        $("#btn_atras").css("display", "inline");
        $("#btn_siguiente_boleta_factura").css("display", "none");
        this.div_seleccionado = "vista_mostrar_resumen_compra";
        this.copiarDatosFin();
        $(".loader").fadeOut("slow");
      }
    }else if(this.div_seleccionado == "vista_mostrar_resumen_compra"){
      $("#btn_atras").css("display", "inline");
      $("#btn_siguiente_boleta_factura").css("display", "none");
    }
    //else if(this.div_seleccionado == "form_mostrar_datos_factura"){
      
    //}
  }

  ocultar_teclados(){
    //console.log(this.div_seleccionado);

    if(this.div_seleccionado == "vista_mostrar_datos_pasajeros"){
      if(this.id_anterior != ""){
        $("#teclado_alfanumerico").css("display", "none");
        $("#teclado_numerico").css("display", "none");
        this.cont_pasajero_nuevo = 1;
      }
    }else if(this.div_seleccionado == "vista_mostrar_tipo_de_compra"){
      $("#teclado_alfanumerico").css("display", "none");
      $("#teclado_numerico").css("display", "none");

      $('#emailDatosContacto').removeClass("input_incorrecto");
      $('#numeroDatosContacto').removeClass("input_incorrecto");

      if($('#emailDatosContacto').val().includes("@") && $('#numeroDatosContacto').val().length >= 9 && this.texto_boleta_factura != ""){
        $("#btn_siguiente_boleta_factura").css("display", "inline");
        $("#div_mensaje_alerta_boleta_factura").css("display", "none");
        $('#emailDatosContacto').addClass("input_correcto");
        $('#numeroDatosContacto').addClass("input_correcto");        
      }else{
        $("#btn_siguiente_boleta_factura").css("display", "none");
        $("#div_mensaje_alerta_boleta_factura").css("display", "flex");

        if(this.texto_boleta_factura == ""){
          this.mensaje_alerta_boleta_factura = "Seleccione una Boleta o Factura.";
        }else if(!$('#emailDatosContacto').val().includes("@")){
          this.mensaje_alerta_boleta_factura = "Ingrese un correo válido.";
          $('#emailDatosContacto').addClass("input_incorrecto");
        }else if($('#numeroDatosContacto').val().length < 9){
          this.mensaje_alerta_boleta_factura = "Ingrese un número de teléfono válido.";
          $('#numeroDatosContacto').addClass("input_incorrecto");
        }
      }
    }else if(this.div_seleccionado == "form_mostrar_datos_factura"){
      $("#teclado_alfanumerico").css("display", "none");
      $("#teclado_numerico").css("display", "none");
      $("#btn_siguiente_boleta_factura").css("display", "none");
      
      $("#btn_editar_ruc").css("display", "inline");
      if(this.texto_boleta_factura == "FACTURA" && this.validarRUC($("#rucSolicitaFactura").val()) == true && $('#razonSolicitaFactura').val() != "" && $('#direccionSolicitaFactura').val() != ""){
        $("#btn_continuar_ruc").css("display", "inline");
      }else{
        $("#btn_continuar_ruc").css("display", "none");
      }
    }else if(this.div_seleccionado == "vista_mostrar_resumen_compra"){
      $("#teclado_alfanumerico").css("display", "none");
      $("#teclado_numerico").css("display", "none");
    }
  }

  click_boton_libre(letra_numero: string){
    if(letra_numero == "borrar"){
      if($("#"+this.texto_id).val() != ""){
        $("#"+this.texto_id).val($("#"+this.texto_id).val().substring(0, $("#"+this.texto_id).val().length - 1));
      }
    }else if(letra_numero == "espacio"){
      $("#"+this.texto_id).val($("#"+this.texto_id).val() + " ");
    }else if(letra_numero == "mayuscula"){
      if(this.cont_mayuscula == 0){
        this.cont_mayuscula = 1;
        $("#fila_alfanumerico_1").addClass("clase_mayuscula");
        $("#fila_alfanumerico_2").addClass("clase_mayuscula");
        $("#fila_alfanumerico_3").addClass("clase_mayuscula");
      }else{
        this.cont_mayuscula = 0;
        $("#fila_alfanumerico_1").removeClass("clase_mayuscula");
        $("#fila_alfanumerico_2").removeClass("clase_mayuscula");
        $("#fila_alfanumerico_3").removeClass("clase_mayuscula");
      }
    }else if(letra_numero == "listo"){
      $("#teclado_alfanumerico").css("display", "none");
      $("#teclado_numerico").css("display", "none");

      this.cont_pasajero_nuevo = 1;

      //console.log(this.div_seleccionado);

      if(this.div_seleccionado == "vista_mostrar_tipo_de_compra" && this.texto_boleta_factura != ""){
        $("#teclado_numerico").css("display", "none");
        $("#btn_siguiente_boleta_factura").css("display", "inline");
      }else if(this.div_seleccionado == "form_mostrar_datos_factura"){
        $("#btn_editar_ruc").css("display", "inline");
        $("#btn_siguiente_boleta_factura").css("display", "none");

        if(this.texto_boleta_factura == "FACTURA" && this.validarRUC($("#rucSolicitaFactura").val()) == true && $('#razonSolicitaFactura').val() != "" && $('#direccionSolicitaFactura').val() != ""){
          $("#btn_continuar_ruc").css("display", "inline");
        }else{
          $("#btn_continuar_ruc").css("display", "none");
        }
      }
    }else{
      if(this.cont_mayuscula == 0){
        $("#"+this.texto_id).val($("#"+this.texto_id).val() + letra_numero);
      }else{
        $("#"+this.texto_id).val($("#"+this.texto_id).val() + letra_numero.toUpperCase());
      }

      this.cont_mayuscula = 0;
      $("#fila_alfanumerico_1").removeClass("clase_mayuscula");
      $("#fila_alfanumerico_2").removeClass("clase_mayuscula");
      $("#fila_alfanumerico_3").removeClass("clase_mayuscula");

    }
  }

  activar_teclado_numerico(id: string, div: string){
    setTimeout(() => {
      this.texto_id = id;
      this.div_seleccionado = div;

      if(div == "vista_mostrar_tipo_de_compra" || div == "form_mostrar_datos_factura"){
        $("#btn_editar_ruc").css("display", "none");
        $("#div_mensaje_alerta_boleta_factura").css("display", "none");
        $("#teclado_numerico").css("display", "flex");
        $('#teclado_numerico').css({
          position: 'absolute',
          top: '59%',
          left: '42%'
        });

        $("#btn_siguiente_boleta_factura").css("display", "none");
        $("#teclado_alfanumerico").css("display", "none");
      }
    }, 250);
  }
  
  activar_teclado_alfanumerico(id: string, div: string, tip_opc_teclado: string){
    setTimeout(() => {
      this.texto_id = id;
      this.div_seleccionado = div;
      this.tip_opc_teclado = tip_opc_teclado;
      $("#div_mensaje_pasajero_nuevo").css("display", "none");

      if(div == "vista_mostrar_datos_pasajeros"){
        $("#teclado_alfanumerico").css("display", "flex");
        $('#teclado_alfanumerico').css({
          position: 'absolute',
          top: '60%',
          left: '30%'
        });

        $('#selectTipDoc_'+this.id_anterior).prop("disabled", false);
        $('#txtdocumento_'+this.id_anterior).prop("readonly", false);
        $('#txtnombres_'+this.id_anterior).prop("readonly", false);
        $('#txtapellidos_'+this.id_anterior).prop("readonly", false);
        $('#fecha_nacimiento_'+this.id_anterior).prop("readonly", false);

        this.cont_pasajero_nuevo = 0;
        $("#teclado_numerico").css("display", "none");
      }else if(div == "vista_mostrar_tipo_de_compra" || div == "form_mostrar_datos_factura"){
        $("#btn_editar_ruc").css("display", "none");
        $("#div_mensaje_alerta_boleta_factura").css("display", "none");
        $("#teclado_alfanumerico").css("display", "flex");
        $('#teclado_alfanumerico').css({
          position: 'absolute',
          top: '60%',
          left: '30%'
        });

        $("#btn_siguiente_boleta_factura").css("display", "none");
        $("#teclado_numerico").css("display", "none");
      }
    }, 250);
  }

  toggleFullscreen(){
    if(this.openScreen == 1) {
      this.closeFullscreen();
    } else {
      this.openFullscreen();
    }
  }

  openFullscreen(){
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }

    this.openScreen = 1;
  }

  closeFullscreen(){
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }

    this.openScreen = 0;
  }

  obtenerTramosIntermedios(escalas: string | null, origen: string, destino: string): string {
    try {
      // Si escalas es null, vacío o solo espacios
      if (!escalas || escalas.trim() === '') {
        return '';
      }

      // Convertimos las escalas en lista, separadas por "-"
      const lista = escalas
        .split(/\s*-\s*/)
        .map(e => e.trim().toUpperCase())
        .filter(e => e.length > 0);

      const indexOrigen = lista.indexOf(origen.toUpperCase());
      const indexDestino = lista.indexOf(destino.toUpperCase());

      // Si el destino no se encuentra, tomamos todo
      const fin = indexDestino === -1 ? lista.length : indexDestino;

      // Si el origen no está, asumimos que empieza desde el primer tramo
      const inicio = indexOrigen === -1 ? -1 : indexOrigen;

      // Obtenemos los tramos intermedios
      const tramos = lista.slice(inicio + 1, fin);

      if (tramos.length === 0) {
        return '';
      }

      return tramos.join('-');

    } catch (e) {
      console.error(e);
      return '';
    }
  }

  /*continuar_terminos_condiciones(){
    $("#vista_mostrar_terminos_condiciones").css("display", "none");
    $("#vista_mostrar_resumen_compra").css("display", "inline");
  }*/
}

/*let url = "https://jsonplaceholder.typicode.com/todos/1";
this.http.get(url, {responseType: 'blob'})
.subscribe((res) => {
  console.log(res)
  saveAs(res, "4C608A66XX.json")
})*/