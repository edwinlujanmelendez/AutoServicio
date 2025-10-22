import { Component, OnInit, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { SharedService } from '../shared.service';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { TaskService } from '../services/task.service';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { AppComponent } from '../app.component';

declare var $:any;

@Component({
  selector: 'app-asientos',
  templateUrl: './asientos.component.html',
  styleUrls: ['./asientos.component.css']
})
export class AsientosComponent implements OnInit {

  date!: Date;
  date_hoy!: string;

  public innerWidth: any;
  public innerHeight: any;

  StorageDatosDetalleItinerarioIda: any = [];
  sub_titulo: string = "Selecciona tu asiento";
  
  estructura_bus_ida: any = [];
  estructura_bus_vuelta: any = [];
  titulo_detalle_piso_1: string = "";
  titulo_detalle_piso_2: string = "";
  array_pisos_final: any[] = [];
  
  asientos_seleccionados: Array<string> = [];
  cont_asientos: number = 0;
  num_asientos: string = "";
  num_asientos_ida: string = "";
  num_asientos_ida_p1: string = "";
  num_asientos_ida_p2: string = "";
  num_asientos_ida_historico: string = "";
  verif: number = 0;
  precio_asientos_ida: Array<string> = [];
  precio_ida_total: number = 0;

  porcentaje_descuento: number = 0;
  preciofinal_descuento: number = 0;
  precio_descuento: number = 0;
  cant_asientos_promocion: number = 0;
  mostrar_mensaje: number = 0;
  estado_promocion: number = 0;
  elegir_promocion: number = 0;
  precio_asientos_ida_promocion: Array<string> = [];

  promocion_cyber: number = 0;
  promocion_ida_vuelta: number = 0;
  promocion_black_movil: number = 0;
  
  nombre_ciudad_origen: string = "";
  nombre_ciudad_destino: string = "";
  idServicioIda: number = 0;
  servicioIda: string = "";
  fechaEmbarqueIda: string = "";
  nombreFechaEmbarqueIda: string = "";

  ida_vuelta: number = 0;
  tiempoBloqueoAsiento: number = 0;
  cant_max_asientos: number = 0;

  tituloMensajeAlerta: string = "";
  textoMensajeAlerta: string = "";

  fecha_ida: string = "";
  hora_embarque_ida: string = "";

  elem: any;
  openScreen: number = 0;

  direccionEmbarqueIda: string = "";
  direccionDesembarqueIda: string = "";

  ipLocal: string = "";

  constructor(private router:Router, private route: ActivatedRoute, private sharedService:SharedService, private http : HttpClient, private taskService: TaskService, @Inject(PLATFORM_ID) private platformId: Object, @Inject(DOCUMENT) private document: any, public appComponent: AppComponent) { 
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

      $('#btn_siguiente').css('display', 'none');

      this.elem = document.documentElement;

      //this.appComponent.clearInterval();
      //this.appComponent.temporizador(5, 10);
      
      this.taskService.getMyIp().subscribe(responseIpLocal =>{
        this.ipLocal = responseIpLocal['ip'];
      });
    }
  }

  ngOnDestroy() {
    if(isPlatformBrowser(this.platformId)){
      
    }
  }

  ngAfterViewInit(){
    if(isPlatformBrowser(this.platformId)){
      let getDatosConfiguracion = JSON.parse(localStorage.getItem('StorageDatosConfiguracion') || '{}');
      if(JSON.stringify(getDatosConfiguracion)!="{}"){
        this.cant_max_asientos = Number(getDatosConfiguracion['cantidad_asientos_select']);
      }

      setTimeout(() => {
        let getDatosDetalleItinerarioIda = JSON.parse(localStorage.getItem('StorageDatosDetalleItinerarioIda') || '{}');
        
        if(JSON.stringify(getDatosDetalleItinerarioIda)!="{}"){
          //console.log(getDatosDetalleItinerarioIda);
          this.StorageDatosDetalleItinerarioIda = getDatosDetalleItinerarioIda;

          this.nombre_ciudad_origen = this.textCapitalize(getDatosDetalleItinerarioIda['nombre_ciudad_origen']);
          this.nombre_ciudad_destino = this.textCapitalize(getDatosDetalleItinerarioIda['nombre_ciudad_destino']);
          this.idServicioIda = getDatosDetalleItinerarioIda['idServicioIda'];
          this.servicioIda = getDatosDetalleItinerarioIda['servicioIda'];
          this.fechaEmbarqueIda = getDatosDetalleItinerarioIda['fechaEmbarqueIda'];
          this.nombreFechaEmbarqueIda = this.convert_nom_fecha(getDatosDetalleItinerarioIda['fechaEmbarqueIda']);
          this.ida_vuelta = getDatosDetalleItinerarioIda['ida_vuelta'];
          this.fecha_ida = this.convert_format_fecha_guion_a_barra(getDatosDetalleItinerarioIda['fechaEmbarqueIda']);
          this.hora_embarque_ida = getDatosDetalleItinerarioIda['horaEmbarqueIda'];

          this.direccionEmbarqueIda = getDatosDetalleItinerarioIda['direccionEmbarqueIda'];
          this.direccionDesembarqueIda = getDatosDetalleItinerarioIda['direccionDesembarqueIda'];

          this.getDatosEstructuraBus(getDatosDetalleItinerarioIda);

          this.taskService.getParametrosAsientos().subscribe(responseParamAsientos => {
            this.tiempoBloqueoAsiento = responseParamAsientos[0].tiempoBloqueoAsiento;
          });
        }
      }, 250);
    }
  }

  textCapitalize(str: string){
    const capitalize = str.slice(0, 1).toUpperCase() + (true ? str.slice(1).toLowerCase() : str.slice(1));

    return capitalize;
  }

  getDatosEstructuraBus(getDatosItinerarioIda: any){
    this.taskService.getEstructuraBus(getDatosItinerarioIda['idItinerarioIda'], getDatosItinerarioIda['idRutaIda']).subscribe(responseEstructuraBus => {
      this.estructura_bus_ida = responseEstructuraBus;
        var cant_piso_1 = 0;
        var cant_piso_2 = 0;
        var array_piso1: string[] = [];
        var array_sub_piso1: string[] = [];
        
        var array_piso2: string[] = [];
        var array_sub_piso2: string[] = [];

        if(responseEstructuraBus['listaAsiento'] != null){
          this.titulo_detalle_piso_1 = responseEstructuraBus['tipoasientopri'];
          this.titulo_detalle_piso_2 = responseEstructuraBus['tipoasientoseg'];

          for(var a=0; a<responseEstructuraBus['listaAsiento'].length; a++){
            if(responseEstructuraBus['listaAsiento'][a]['piso'] == 0){
              array_piso1.push(responseEstructuraBus['listaAsiento'][a]);
              cant_piso_1++;
            }
            if(responseEstructuraBus['listaAsiento'][a]['piso'] == 1){
              array_piso2.push(responseEstructuraBus['listaAsiento'][a]);
              cant_piso_2++;
            }
          }
        }

        var num_filas_piso1 = 0;
        if(array_piso1.length != 0){                //Elije el máximo
          num_filas_piso1 = Math.max.apply(Math, array_piso1.map(function(o) { return o['fila']; }));
        }

        var num_filas_piso2 = 0;
        if(array_piso2.length != 0){                //Elije el máximo
          num_filas_piso2 = Math.max.apply(Math, array_piso2.map(function(o) { return o['fila']; }));
        }
        
        var array_pisos_1: any[] = [];
        var sub_array_pisos_1: any[] = [];
        var array_pisos_1_final: any[] = [];
        var array_pisos_2: any[] = [];
        var sub_array_pisos_2: any[] = [];
        var array_pisos_2_final: any[] = [];

        if(num_filas_piso1 != 0){
          for(var a=0; a<=num_filas_piso1; a++){
            array_sub_piso1 = [];
            for(var b=0; b<array_piso1.length; b++){
              if(array_piso1[b]['fila'] == a){
                array_sub_piso1.push(array_piso1[b]);
              }
            }
            array_pisos_1.push(array_sub_piso1);
          }
        }

        if(num_filas_piso2 != 0){
          for(var a=0; a<=num_filas_piso2; a++){
            array_sub_piso2 = [];
            for(var b=0; b<array_piso2.length; b++){
              if(array_piso2[b]['fila'] == a){
                array_sub_piso2.push(array_piso2[b]);
              }
            }
            array_pisos_2.push(array_sub_piso2);
          }
        }
        
        for(var a=0; a<array_pisos_1.length; a++){
          var array_asientos = [0, 1, 2, 3, 4];
          sub_array_pisos_1 = [];
          var sub_mensaje = "";

          if(array_pisos_1[a][0] && array_pisos_1[a][1] && array_pisos_1[a][2] && array_pisos_1[a][3] && array_pisos_1[a][4]){
            if((array_pisos_1[a][0].tipoObjeto == 5 && array_pisos_1[a][0].tipoTarifa == 0) && (array_pisos_1[a][1].tipoObjeto == 5 && array_pisos_1[a][1].tipoTarifa == 0) && (array_pisos_1[a][2].tipoObjeto == 5 && array_pisos_1[a][2].tipoTarifa == 0) && (array_pisos_1[a][3].tipoObjeto == 5 && array_pisos_1[a][3].tipoTarifa == 0) && (array_pisos_1[a][4].tipoObjeto == 5 && array_pisos_1[a][4].tipoTarifa == 0)){
              sub_mensaje = "mensaje";
            }
          }

          if(array_pisos_1[a][0]){
            sub_array_pisos_1.push(array_pisos_1[a][0]);
            var i = array_asientos.indexOf(array_pisos_1[a][0].columna);
            array_asientos.splice(i, 1);
          }

          if(array_pisos_1[a][1]){
            sub_array_pisos_1.push(array_pisos_1[a][1]);
            var i = array_asientos.indexOf(array_pisos_1[a][1].columna);
            array_asientos.splice(i, 1);
          }

          if(array_pisos_1[a][2]){
              sub_array_pisos_1.push(array_pisos_1[a][2]);
              var i = array_asientos.indexOf(array_pisos_1[a][2].columna);
              array_asientos.splice(i, 1);
          }

          if(array_pisos_1[a][3]){
              sub_array_pisos_1.push(array_pisos_1[a][3]);
              var i = array_asientos.indexOf(array_pisos_1[a][3].columna);
              array_asientos.splice(i, 1);
          }

          if(array_pisos_1[a][4]){
              sub_array_pisos_1.push(array_pisos_1[a][4]);
              var i = array_asientos.indexOf(array_pisos_1[a][4].columna);
              array_asientos.splice(i, 1);
          }

          for(var aa=0; aa<array_asientos.length; aa++){
            sub_array_pisos_1.push({"asiento": 0,
              "bloqueado": 1,
              "columna": array_asientos[aa],
              "estadoAsiento": 0,
              "fila": a,
              "piso": 0,
              "tarifaAsiento": 0,
              "tipoObjeto": 5
            });
          }

          sub_array_pisos_1.sort((a, b) => a.columna - b.columna); 

          array_pisos_1_final.push(sub_array_pisos_1);

          if(sub_mensaje == "mensaje"){
            sub_array_pisos_1 = [];
            var array_asientos2 = [0, 1, 2, 3, 4];

            for(var bb=0; bb<array_asientos2.length; bb++){
              sub_array_pisos_1.push({"asiento": 0,
                "bloqueado": 1,
                "columna": array_asientos2[bb],
                "estadoAsiento": 0,
                "fila": a,
                "piso": 0,
                "tarifaAsiento": 0,
                "tipoObjeto": 99
              });
            }

            sub_array_pisos_1.sort((a, b) => a.columna - b.columna); 

            array_pisos_1_final.push(sub_array_pisos_1);
          }
        }

        for(var a=0; a<array_pisos_2.length; a++){
          var array_asientos = [0, 1, 2, 3, 4];
          sub_array_pisos_2 = [];

          if(array_pisos_2[a][0]){
            sub_array_pisos_2.push(array_pisos_2[a][0]);
            var i = array_asientos.indexOf(array_pisos_2[a][0].columna);
            array_asientos.splice(i, 1);
          }

          if(array_pisos_2[a][1]){
            sub_array_pisos_2.push(array_pisos_2[a][1]);
            var i = array_asientos.indexOf(array_pisos_2[a][1].columna);
            array_asientos.splice(i, 1);
          }

          if(array_pisos_2[a][2]){
            sub_array_pisos_2.push(array_pisos_2[a][2]);
              var i = array_asientos.indexOf(array_pisos_2[a][2].columna);
              array_asientos.splice(i, 1);
          }

          if(array_pisos_2[a][3]){
            sub_array_pisos_2.push(array_pisos_2[a][3]);
              var i = array_asientos.indexOf(array_pisos_2[a][3].columna);
              array_asientos.splice(i, 1);
          }

          if(array_pisos_2[a][4]){
            sub_array_pisos_2.push(array_pisos_2[a][4]);
              var i = array_asientos.indexOf(array_pisos_2[a][4].columna);
              array_asientos.splice(i, 1);
          }

          for(var aa=0; aa<array_asientos.length; aa++){
            sub_array_pisos_2.push({"asiento": 0,
              "bloqueado": 1,
              "columna": array_asientos[aa],
              "estadoAsiento": 0,
              "fila": a,
              "piso": 0,
              "tarifaAsiento": 0,
              "tipoObjeto": 5
            });
          }

          sub_array_pisos_2.sort((a, b) => a.columna - b.columna); 

          array_pisos_2_final.push(sub_array_pisos_2);
        }

        this.array_pisos_final = [];

        if(array_pisos_1_final.length != 0){
          this.array_pisos_final.push(array_pisos_1_final);
        }

        if(array_pisos_2_final.length != 0){
          this.array_pisos_final.push(array_pisos_2_final);
        }

        $(".loader").fadeOut("slow");
    });
  }

  seleccionar_asiento(piso: number, asiento: number, precio: number){
    if(isPlatformBrowser(this.platformId)){
      var desc = 2;
      if(this.asientos_seleccionados.includes(piso+"_"+asiento+"_"+precio)){
        if($("#"+piso+"_"+asiento+"_"+precio).hasClass('casilla_asiento') || $("#"+piso+"_"+asiento+"_"+precio).hasClass('casilla_asiento_seleccionado')){
          $("#"+piso+"_"+asiento+"_"+precio).toggleClass('casilla_asiento casilla_asiento_seleccionado');
        }
        if($("#"+piso+"_"+asiento+"_"+precio).hasClass('casilla_asiento_imbatible') || $("#"+piso+"_"+asiento+"_"+precio).hasClass('casilla_asiento_seleccionado_imbatible')){
          $("#"+piso+"_"+asiento+"_"+precio).toggleClass('casilla_asiento_imbatible casilla_asiento_seleccionado_imbatible');
        }
        if($("#"+piso+"_"+asiento+"_"+this.quitar_punto(precio)).hasClass('casilla_asiento_ecominterno') || $("#"+piso+"_"+asiento+"_"+this.quitar_punto(precio)).hasClass('casilla_asiento_seleccionado_ecominterno')){
          $("#"+piso+"_"+asiento+"_"+this.quitar_punto(precio)).toggleClass('casilla_asiento_ecominterno casilla_asiento_seleccionado_ecominterno');
        }
        
        this.removeItemAsientos(this.asientos_seleccionados, piso+"_"+asiento+"_"+precio);
        desc = 0;
      }else{
        if(this.cont_asientos < this.cant_max_asientos){
          if($("#"+piso+"_"+asiento+"_"+precio).hasClass('casilla_asiento_seleccionado') || $("#"+piso+"_"+asiento+"_"+precio).hasClass('casilla_asiento')){
            $("#"+piso+"_"+asiento+"_"+precio).toggleClass('casilla_asiento casilla_asiento_seleccionado');
          }
          if($("#"+piso+"_"+asiento+"_"+precio).hasClass('casilla_asiento_seleccionado_imbatible') || $("#"+piso+"_"+asiento+"_"+precio).hasClass('casilla_asiento_imbatible')){
            $("#"+piso+"_"+asiento+"_"+precio).toggleClass('casilla_asiento_imbatible casilla_asiento_seleccionado_imbatible');
          }
          
          if($("#"+piso+"_"+asiento+"_"+this.quitar_punto(precio)).hasClass('casilla_asiento_seleccionado_ecominterno') || $("#"+piso+"_"+asiento+"_"+this.quitar_punto(precio)).hasClass('casilla_asiento_ecominterno')){
            $("#"+piso+"_"+asiento+"_"+this.quitar_punto(precio)).toggleClass('casilla_asiento_ecominterno casilla_asiento_seleccionado_ecominterno');
          }
          
          this.asientos_seleccionados.push(piso+"_"+asiento+"_"+precio);
          this.cont_asientos++;
          desc = 1;
        }else{
          this.mostrar_modal("modal_limitmax");
        }
      }

      this.calcular_pasajeros();

      var valAsientoPromocion = 0;

      if(this.promocion_cyber == 1 || this.promocion_ida_vuelta == 1 || this.promocion_black_movil == 1){
        valAsientoPromocion = this.verificarAsientoPromocion(1);
      }
      
      if(valAsientoPromocion == 1){
          this.verif = this.verificarAsientoPromocionUnitario(piso, asiento);
          this.calcular_promocion_total_pasajeros(desc);
      }else{
        if(this.innerWidth<800){
          $('#precio_total_mobile_normal').css('display', 'inline');
          $('#precio_total_mobile_promocion').css('display', 'none');
        }else{
          $('#precio_total_desktop_normal').css('display', 'inline');
          $('#precio_total_desktop_promocion').css('display', 'none');
        }

        this.elegir_promocion = 0;
      }

      /*if(this.asientos_seleccionados.length != 0 && this.innerWidth>800){
        $('#btn_desktop_confirm_asient').css('display', 'inline');
      }else if(this.asientos_seleccionados.length == 0 && this.innerWidth>800){
        $('#btn_desktop_confirm_asient').css('display', 'none');
      }else if(this.asientos_seleccionados.length != 0 && this.innerWidth<800){
        $('#btn_desktop_confirm_asient').css('display', 'none');
      }*/

      if(this.asientos_seleccionados.length > 0){
        //$('#btn_siguiente').css('display', 'inline');
        $('#btn_desktop_confirm_asient').css('display', 'inline-block');
        $('#txt_message').css('display', 'inline');
      }else{
        //$('#btn_siguiente').css('display', 'none');
        $('#btn_desktop_confirm_asient').css('display', 'none');
        $('#txt_message').css('display', 'none');
      }
    }
  }

  calcular_pasajeros(){
    if(isPlatformBrowser(this.platformId)){
      this.num_asientos = "";
      this.precio_ida_total = 0;
      this.num_asientos_ida_p1 = "";
      this.num_asientos_ida_p2 = "";
      this.num_asientos_ida = "";
      this.precio_asientos_ida = [];

      for(var a=0; a<this.asientos_seleccionados.length; a++){
        
        var part_asi = this.asientos_seleccionados[a].split("_");

        if(part_asi[0] == "0"){
          if(this.num_asientos_ida_p1 == ""){
            this.num_asientos_ida_p1 = part_asi[1];
          }else{
            this.num_asientos_ida_p1 = this.num_asientos_ida_p1+","+part_asi[1];
          }
        }

        if(part_asi[0] == "1"){
          if(this.num_asientos_ida_p2 == ""){
            this.num_asientos_ida_p2 = part_asi[1];
          }else{
            this.num_asientos_ida_p2 = this.num_asientos_ida_p2+","+part_asi[1];
          }
        }

        if(this.num_asientos_ida == ""){
          this.num_asientos_ida = part_asi[1]+"-"+part_asi[0];
          this.precio_asientos_ida.push(part_asi[2]);
        }else{
          this.num_asientos_ida = this.num_asientos_ida+","+part_asi[1]+"-"+part_asi[0];
          this.precio_asientos_ida.push(part_asi[2]);
        }

        if(part_asi[0] != ""){
          if(this.num_asientos == ""){
            this.num_asientos = part_asi[1];
          }else{
            this.num_asientos = this.num_asientos+","+part_asi[1];
          }
        }
        
        this.precio_ida_total = this.precio_ida_total + parseFloat(part_asi[2]);
      }
    }
  }

  removeItemAsientos(arr : any, item : any ) {
    if(isPlatformBrowser(this.platformId)){
      var i = arr.indexOf(item);
      arr.splice( i, 1 );
      this.cont_asientos--;
    }
  }

  verificarAsientoPromocion(idIdaVuelta: number){
    var val = 0;
    
    var partAsiento;
    var partAsientos;

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
    
    if(this.num_asientos_ida.includes(",")){
      partAsientos = this.num_asientos_ida.split(",");
      for(var a=0; a<partAsientos.length; a++){
        partAsiento = partAsientos[a].split("-");
        partAsiento[0];
        partAsiento[1];
        if(idIdaVuelta == 1){
          for(var b=0; b<this.estructura_bus_ida.listaAsiento.length; b++){
            if(this.estructura_bus_ida.listaAsiento[b].asiento == partAsiento[0] && this.estructura_bus_ida.listaAsiento[b].piso == partAsiento[1]){
              if(this.estructura_bus_ida.listaAsiento[b].tipoTarifa == 3 || this.estructura_bus_ida.listaAsiento[b].tipoTarifa == 9 || this.estructura_bus_ida.listaAsiento[b].tipoTarifa == 4){
                //Valor 0 sigue igual.
              }else if(this.idServicioIda==21 || this.idServicioIda==27 || this.idServicioIda==34 || this.idServicioIda==24){
                if(this.estructura_bus_ida.listaAsiento[b].tipoTarifa == 4){
                  //Valor 0 sigue igual.
                }else{
                  val++;
                }
              }else{
                val++;
              }
            }
          }
        }
      }
    }else{
      if(this.num_asientos_ida != ""){
        this.num_asientos_ida_historico = this.num_asientos_ida;
        partAsiento = this.num_asientos_ida.split("-");
        partAsiento[0];
        partAsiento[1];
        if(idIdaVuelta == 1){
          for(var b=0; b<this.estructura_bus_ida.listaAsiento.length; b++){
            if(this.estructura_bus_ida.listaAsiento[b].asiento == partAsiento[0] && this.estructura_bus_ida.listaAsiento[b].piso == partAsiento[1]){
              if(this.estructura_bus_ida.listaAsiento[b].tipoTarifa == 3 || this.estructura_bus_ida.listaAsiento[b].tipoTarifa == 9 || this.estructura_bus_ida.listaAsiento[b].tipoTarifa == 4){
                //Valor 0 sigue igual.
              }else if(this.idServicioIda==21 || this.idServicioIda==27 || this.idServicioIda==34 || this.idServicioIda==24){
                if(this.estructura_bus_ida.listaAsiento[b].tipoTarifa == 4){
                  //Valor 0 sigue igual.
                }else{
                  val++;
                }
              }else{
                val++;
              }
            }
          }
        }      
      }else{
        partAsiento = this.num_asientos_ida_historico.split("-");
        partAsiento[0];
        partAsiento[1];
        if(idIdaVuelta == 1){
          for(var b=0; b<this.estructura_bus_ida.listaAsiento.length; b++){
            if(this.estructura_bus_ida.listaAsiento[b].asiento == partAsiento[0] && this.estructura_bus_ida.listaAsiento[b].piso == partAsiento[1]){
              if(this.estructura_bus_ida.listaAsiento[b].tipoTarifa == 3 || this.estructura_bus_ida.listaAsiento[b].tipoTarifa == 9 || this.estructura_bus_ida.listaAsiento[b].tipoTarifa == 4){
                //Valor 0 sigue igual.
              }else{
                val++;
              }
            }
          }
        }
        this.num_asientos_ida_historico = "";
      }
    }

    if(val>0){
      val = 0;
    }else{
      val = 1;
    }

    return val;
  }

  verificarAsientoPromocionUnitario(piso: any, asiento: any){
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
    
    for(var b=0; b<this.estructura_bus_ida.listaAsiento.length; b++){
      if(this.estructura_bus_ida.listaAsiento[b].asiento == asiento && this.estructura_bus_ida.listaAsiento[b].piso == piso){
        if(this.estructura_bus_ida.listaAsiento[b].tipoTarifa == 3 || this.estructura_bus_ida.listaAsiento[b].tipoTarifa == 9 || this.estructura_bus_ida.listaAsiento[b].tipoTarifa == 4){
          val = 0;
        }else{
          val++;
        }
      }
    }
    
    if(val>0){
      val = 0;
    }else{
      val = 1;
    }

    return val;
  }

  calcular_promocion_total_pasajeros(desc: number){
    if(isPlatformBrowser(this.platformId)){
      if(this.innerWidth>766){
        if(this.estado_promocion == 1 && this.asientos_seleccionados.length<=this.cant_asientos_promocion && this.asientos_seleccionados.length>0){
          if(this.porcentaje_descuento!=0){
            this.precio_descuento = Math.trunc(this.precio_ida_total - (this.precio_ida_total*this.porcentaje_descuento)/100);
          }else{
            if(this.asientos_seleccionados.length == 1){
              this.precio_descuento = this.preciofinal_descuento;
            }else{
              if(desc==1){
                this.precio_descuento += this.preciofinal_descuento;
              }
              if(desc==0 && this.verif==1){
                this.precio_descuento -= this.preciofinal_descuento;
              }
            }
          }

          $('#precio_total_desktop_normal').css('display', 'none');
          $('#precio_total_desktop_promocion').css('display', 'inline');

          this.elegir_promocion = 1;
        }else{
          if(desc==0){
            this.precio_descuento -= this.preciofinal_descuento;
          }
          $('#precio_total_desktop_normal').css('display', 'inline');
          $('#precio_total_desktop_promocion').css('display', 'none');

          this.elegir_promocion = 0;
        }
      }else{
        if(this.estado_promocion == 1 && this.asientos_seleccionados.length<=this.cant_asientos_promocion && this.asientos_seleccionados.length>0){
          if(this.porcentaje_descuento!=0){
            this.precio_descuento = Math.trunc(this.precio_ida_total - (this.precio_ida_total*this.porcentaje_descuento)/100);
          }else{
            if(this.asientos_seleccionados.length == 1){
              this.precio_descuento = this.preciofinal_descuento;
            }else{
              if(desc==1){
                this.precio_descuento += this.preciofinal_descuento;
              }
              if(desc==0 && this.verif==1){
                this.precio_descuento -= this.preciofinal_descuento;
              }
            }
          }

          $('#precio_total_mobile_normal').css('display', 'none');
          $('#precio_total_mobile_promocion').css('display', 'inline');
          $('#precio_total_mobile_promocion2').css('display', 'inline');

          this.elegir_promocion = 1;
        }else{
          if(desc==0){
            this.precio_descuento -= this.preciofinal_descuento;
          }

          $('#precio_total_mobile_normal').css('display', 'inline');
          $('#precio_total_mobile_promocion').css('display', 'none');
          $('#precio_total_mobile_promocion2').css('display', 'none');

          this.elegir_promocion = 0;
        }
      }
    }
  }

  atras(){
    this.router.navigate(['itinerario']);
  }

  siguiente(){
    $(".loader").fadeIn("slow");

    if(this.precio_ida_total == 0){
      $(".loader").fadeOut("slow");
      this.notificacion_mensajes("Warning", "Debe seleccionar un Asiento para poder continuar.");
    }else{
      if(this.ida_vuelta == 1){
        var dat = {
          "nombre_ciudad_origen": this.StorageDatosDetalleItinerarioIda['nombre_ciudad_origen'],
          "nombre_ciudad_destino": this.StorageDatosDetalleItinerarioIda['nombre_ciudad_destino'],
          "fechaEmbarqueIda": this.StorageDatosDetalleItinerarioIda['fechaEmbarqueIda'],
          "fechaDesembarqueIda": this.StorageDatosDetalleItinerarioIda['fechaDesembarqueIda'],
          "horaEmbarqueIda": this.StorageDatosDetalleItinerarioIda['horaEmbarqueIda'],
          "horaDesembarqueIda": this.StorageDatosDetalleItinerarioIda['horaDesembarqueIda'],
          "agenciaEmbarqueIda": this.StorageDatosDetalleItinerarioIda['agenciaEmbarqueIda'],
          "agenciaDesembarqueIda": this.StorageDatosDetalleItinerarioIda['agenciaDesembarqueIda'],
          "direccionEmbarqueIda": this.StorageDatosDetalleItinerarioIda['direccionEmbarqueIda'],
          "direccionDesembarqueIda": this.StorageDatosDetalleItinerarioIda['direccionDesembarqueIda'],
          "idAgenciaEmbarqueIda": this.StorageDatosDetalleItinerarioIda['idAgenciaEmbarqueIda'],
          "idAgenciaDesembarqueIda": this.StorageDatosDetalleItinerarioIda['idAgenciaDesembarqueIda'],
          "idServicioIda": this.StorageDatosDetalleItinerarioIda['idServicioIda'],
          "servicioIda": this.StorageDatosDetalleItinerarioIda['servicioIda'],
          "idItinerarioIda": this.StorageDatosDetalleItinerarioIda['idItinerarioIda'],
          "idRutaIda": this.StorageDatosDetalleItinerarioIda['idRutaIda'],
          "fechaEmbarqueVuelta": "",
          "fechaDesembarqueVuelta": "",
          "horaEmbarqueVuelta": "",
          "horaDesembarqueVuelta": "",
          "agenciaEmbarqueVuelta": "",
          "agenciaDesembarqueVuelta": "",
          "direccionEmbarqueVuelta": "",
          "direccionDesembarqueVuelta": "",
          "idAgenciaEmbarqueVuelta": "",
          "idAgenciaDesembarqueVuelta": "",
          "idServicioVuelta": "",
          "servicioVuelta": "",
          "idItinerarioVuelta": "",
          "idRutaVuelta": "",
          "numAsientosIda": this.num_asientos_ida,
          "numAsientosIdaP1": this.num_asientos_ida_p1,
          "numAsientosIdaP2": this.num_asientos_ida_p2,
          "estructuraBusIda": this.estructura_bus_ida,
          "numAsientosVuelta": "",
          "numAsientosVueltaP1": "",
          "numAsientosVueltaP2": "",
          "estructuraBusVuelta": [],
          "listaIdaDisponibles": this.StorageDatosDetalleItinerarioIda['listaIdaDisponibles'],
          "listaVueltaDisponibles": this.StorageDatosDetalleItinerarioIda['listaVueltaDisponibles'],
          "ida_vuelta": this.StorageDatosDetalleItinerarioIda['ida_vuelta'],
          "precioAsientosIda": this.precio_asientos_ida,
          "precioAsientosVuelta": [],
          "precioTotalIda": this.precio_ida_total,
          "precioTotalVuelta": 0,
          "precioTotal": this.precio_ida_total
        };
        
        //console.log(dat);

        //localStorage.setItem("StorageDatosPasajeros", JSON.stringify(dat));
        //this.ir_datos_pasajeros();

        if(dat.numAsientosIda.includes(",")){
          var part_asi = dat.numAsientosIda.split(",");
  
          for(var a=0; a<part_asi.length; a++){
            var part_asi2 = String(part_asi[a]).split("-");
            let list_asientos: any = [];
            let list_pisos: any = [];

            list_asientos.push(Number(part_asi2[0]));
            list_pisos.push(Number(part_asi2[1])); 
          
            var part_fecha = dat.fechaEmbarqueIda.split("-");
            var fecha_partida = part_fecha[2]+"/"+part_fecha[1]+"/"+part_fecha[0];

            this.taskService.postBloquearAsiento(Number(dat.idRutaIda), Number(dat.idItinerarioIda), fecha_partida, list_asientos, dat.horaEmbarqueIda, list_pisos, this.tiempoBloqueoAsiento, Number(dat.precioAsientosIda[a]), this.ipLocal).subscribe(response => {
              if(response['result'] == true){
                //dat[0].promocionIda = 0;
                //dat[0].promocionVuelta = 0;
                localStorage.setItem("StorageDatosPasajeros", JSON.stringify(dat));
                this.ir_datos_pasajeros();
              }else{
                let getDatosDetalleItinerarioIda = JSON.parse(localStorage.getItem('StorageDatosDetalleItinerarioIda') || '{}');
                this.getDatosEstructuraBus(getDatosDetalleItinerarioIda);
                this.cont_asientos = 0;
                this.asientos_seleccionados = [];
                this.calcular_pasajeros();
                this.mostrar_modal("modal_asientos_ocupados");
              }
            });
          }
        }else if(dat.numAsientosIda!="" && !dat.numAsientosIda.includes(",")){
          var part_asi = dat.numAsientosIda.split("-");
          var part_fecha = dat.fechaEmbarqueIda.split("-");
          var fecha_partida = part_fecha[2]+"/"+part_fecha[1]+"/"+part_fecha[0];
  
          let list_asientos: any = [];
          let list_pisos: any = [];
  
          list_asientos.push(Number(part_asi[0]));
          list_pisos.push(Number(part_asi[1])); 
  
          this.taskService.postBloquearAsiento(Number(dat.idRutaIda), Number(dat.idItinerarioIda), fecha_partida, list_asientos, dat.horaEmbarqueIda, list_pisos, this.tiempoBloqueoAsiento, Number(dat.precioAsientosIda), this.ipLocal).subscribe(response => {
            if(response['result'] == true){
              //dat[0].promocionIda = 0;
              //dat[0].promocionVuelta = 0;
              localStorage.setItem("StorageDatosPasajeros", JSON.stringify(dat));
              this.ir_datos_pasajeros();
            }else{
              let getDatosDetalleItinerarioIda = JSON.parse(localStorage.getItem('StorageDatosDetalleItinerarioIda') || '{}');
              this.getDatosEstructuraBus(getDatosDetalleItinerarioIda);
              this.cont_asientos = 0;
              this.asientos_seleccionados = [];
              this.calcular_pasajeros();
              this.mostrar_modal("modal_asientos_ocupados");
            }
          });
        }
      }else if(this.ida_vuelta == 2){
        var dat = {
          "nombre_ciudad_origen": this.StorageDatosDetalleItinerarioIda['nombre_ciudad_origen'],
          "nombre_ciudad_destino": this.StorageDatosDetalleItinerarioIda['nombre_ciudad_destino'],
          "fechaEmbarqueIda": this.StorageDatosDetalleItinerarioIda['fechaEmbarqueIda'],
          "fechaDesembarqueIda": this.StorageDatosDetalleItinerarioIda['fechaDesembarqueIda'],
          "horaEmbarqueIda": this.StorageDatosDetalleItinerarioIda['horaEmbarqueIda'],
          "horaDesembarqueIda": this.StorageDatosDetalleItinerarioIda['horaDesembarqueIda'],
          "agenciaEmbarqueIda": this.StorageDatosDetalleItinerarioIda['agenciaEmbarqueIda'],
          "agenciaDesembarqueIda": this.StorageDatosDetalleItinerarioIda['agenciaDesembarqueIda'],
          "direccionEmbarqueIda": this.StorageDatosDetalleItinerarioIda['direccionEmbarqueIda'],
          "direccionDesembarqueIda": this.StorageDatosDetalleItinerarioIda['direccionDesembarqueIda'],
          "idAgenciaEmbarqueIda": this.StorageDatosDetalleItinerarioIda['idAgenciaEmbarqueIda'],
          "idAgenciaDesembarqueIda": this.StorageDatosDetalleItinerarioIda['idAgenciaDesembarqueIda'],
          "idServicioIda": this.StorageDatosDetalleItinerarioIda['idServicioIda'],
          "servicioIda": this.StorageDatosDetalleItinerarioIda['servicioIda'],
          "idItinerarioIda": this.StorageDatosDetalleItinerarioIda['idItinerarioIda'],
          "idRutaIda": this.StorageDatosDetalleItinerarioIda['idRutaIda'],
          "fechaEmbarqueVuelta": String(this.StorageDatosDetalleItinerarioIda['fechaEmbarqueVuelta']),
          "fechaDesembarqueVuelta": "",
          "horaEmbarqueVuelta": "",
          "horaDesembarqueVuelta": "",
          "agenciaEmbarqueVuelta": "",
          "agenciaDesembarqueVuelta": "",
          "direccionEmbarqueVuelta": "",
          "direccionDesembarqueVuelta": "",
          "idAgenciaEmbarqueVuelta": "",
          "idAgenciaDesembarqueVuelta": "",
          "idServicioVuelta": "",
          "servicioVuelta": "",
          "idItinerarioVuelta": "",
          "idRutaVuelta": "",
          "numAsientosIda": this.num_asientos_ida,
          "numAsientosIdaP1": this.num_asientos_ida_p1,
          "numAsientosIdaP2": this.num_asientos_ida_p2,
          "estructuraBusIda": this.estructura_bus_ida,
          "numAsientosVuelta": "",
          "numAsientosVueltaP1": "",
          "numAsientosVueltaP2": "",
          "estructuraBusVuelta": [],
          "listaIdaDisponibles": this.StorageDatosDetalleItinerarioIda['listaIdaDisponibles'],
          "listaVueltaDisponibles": this.StorageDatosDetalleItinerarioIda['listaVueltaDisponibles'],
          "ida_vuelta": this.StorageDatosDetalleItinerarioIda['ida_vuelta'],
          "precioAsientosIda": this.precio_asientos_ida,
          "precioAsientosVuelta": [],
          "precioTotalIda": this.precio_ida_total,
          "precioTotalVuelta": 0,
          "precioTotal": this.precio_ida_total
        };
  
        //localStorage.setItem("StorageDatosAsientos", JSON.stringify(dat));
        //this.ir_itinerario_retorno();

        if(dat.numAsientosIda.includes(",")){
          var part_asi = dat.numAsientosIda.split(",");
          
          for(var a=0; a<part_asi.length; a++){
            var part_asi2 = String(part_asi[a]).split("-");
            
            let list_asientos: any = [];
            let list_pisos: any = [];

            list_asientos.push(Number(part_asi2[0]));
            list_pisos.push(Number(part_asi2[1])); 
          
            var part_fecha = dat.fechaEmbarqueIda.split("-");
            var fecha_partida = part_fecha[2]+"/"+part_fecha[1]+"/"+part_fecha[0];

            this.taskService.postBloquearAsiento(Number(dat.idRutaIda), Number(dat.idItinerarioIda), fecha_partida, list_asientos, dat.horaEmbarqueIda, list_pisos, this.tiempoBloqueoAsiento, Number(dat.precioAsientosIda[a]), this.ipLocal).subscribe(response => {
              if(response['result'] == true){
                //dat[0].promocionIda = 0;
                //dat[0].promocionVuelta = 0;
                localStorage.setItem("StorageDatosAsientos", JSON.stringify(dat));
                this.ir_itinerario_retorno();
              }else{
                let getDatosDetalleItinerarioIda = JSON.parse(localStorage.getItem('StorageDatosDetalleItinerarioIda') || '{}');
                this.getDatosEstructuraBus(getDatosDetalleItinerarioIda);
                this.cont_asientos = 0;
                this.asientos_seleccionados = [];
                this.calcular_pasajeros();
                this.mostrar_modal("modal_asientos_ocupados");
              }
            });
          }
        }else if(dat.numAsientosIda!="" && !dat.numAsientosIda.includes(",")){
          var part_asi = dat.numAsientosIda.split("-");
          var part_fecha = dat.fechaEmbarqueIda.split("-");
          var fecha_partida = part_fecha[2]+"/"+part_fecha[1]+"/"+part_fecha[0];
  
          let list_asientos: any = [];
          let list_pisos: any = [];
  
          list_asientos.push(Number(part_asi[0]));
          list_pisos.push(Number(part_asi[1])); 
  
          this.taskService.postBloquearAsiento(Number(dat.idRutaIda), Number(dat.idItinerarioIda), fecha_partida, list_asientos, dat.horaEmbarqueIda, list_pisos, this.tiempoBloqueoAsiento, Number(dat.precioAsientosIda), this.ipLocal).subscribe(response => {
            if(response['result'] == true){
              //dat[0].promocionIda = 0;
              //dat[0].promocionVuelta = 0;
              localStorage.setItem("StorageDatosAsientos", JSON.stringify(dat));
              this.ir_itinerario_retorno();
            }else{
              let getDatosDetalleItinerarioIda = JSON.parse(localStorage.getItem('StorageDatosDetalleItinerarioIda') || '{}');
              this.getDatosEstructuraBus(getDatosDetalleItinerarioIda);
              this.cont_asientos = 0;
              this.asientos_seleccionados = [];
              this.calcular_pasajeros();
              this.mostrar_modal("modal_asientos_ocupados");
            }
          });
        }
      }

      $(".loader").fadeOut("slow");
    }
  }

  notificacion_mensajes_alerta(titulo: string, mensaje: string){
    this.tituloMensajeAlerta = titulo;
    this.textoMensajeAlerta = mensaje;

    this.mostrar_modal("modal_mensajealerta");
  }

  ir_datos_pasajeros(){
    this.router.navigate(['datos-pasajeros']);
  }

  ir_itinerario_retorno(){
    this.router.navigate(['itinerario-retorno']);
  }

  ir_al_home(){
    this.router.navigate(['']);
  }

  quitar_punto(tarifaAsiento: any){
    var tarifa_asiento = "";
    if(String(tarifaAsiento).includes('.')){
      tarifa_asiento = String(tarifaAsiento).replace('.', '');
    }else{
      tarifa_asiento = String(tarifaAsiento);
    }
    
    return tarifa_asiento;
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

  convert_format_fecha_guion_a_barra(fecha: string){
    if(fecha != "" && fecha != null){
      var part_fecha = fecha.split("-");
      var new_fecha = part_fecha[2]+"/"+part_fecha[1]+"/"+part_fecha[0];
      //              DIA            -  MES            -  AÑO
      return new_fecha;
    }else{
      return "";
    }
  }

  notificacion_mensajes(tipo: String, message: String){
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
}
