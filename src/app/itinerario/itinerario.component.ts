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
  selector: 'app-itinerario',
  templateUrl: './itinerario.component.html',
  styleUrls: ['./itinerario.component.css']
})
export class ItinerarioComponent implements OnInit {

  sub_titulo: string = "Selecciona el horario y servicio";
  public innerWidth: any;
  public innerHeight: any;

  promocionIda: number = 0;
  promocionVuelta: number = 0;

  listaIdaDisponibles: any;
  listaVueltaDisponibles: any;

  ida_vuelta: number = 0;

  date!: Date;
  date_actual!: string;

  itinerario_seleccionado: any = [];
  StorageDatosItinerario: any = [];

  datos: any = [];

  nombre_ciudad_origen: string = "";
  nombre_ciudad_destino: string = "";
  fecha_ida: string = "";

  tituloMensajeAlerta: string = "";
  textoMensajeAlerta: string = "";

  nombre_fecha_hoy: string = "";
  hora_actual: string = "";

  elem: any;
  openScreen: number = 0;

  direccion_embarque: string = "";
  direccion_desembarque: string = "";

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
    this.date_actual = anio + "-" + mes + "-" + dia;
  }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId)){
      this.innerWidth = window.innerWidth;
      this.innerHeight = window.innerHeight;

      $('#btn_siguiente').css('display', 'none');
      this.elem = document.documentElement;

      //this.appComponent.clearInterval();
      //this.appComponent.temporizador(5, 10);
    }
  }

  ngOnDestroy() {
    if(isPlatformBrowser(this.platformId)){
      
    }
  }

  ngAfterViewInit(){
    if(isPlatformBrowser(this.platformId)){
      setTimeout(() => {
        let getDatosItinerario = JSON.parse(localStorage.getItem('StorageDatosItinerario') || '{}');
        
        if(JSON.stringify(getDatosItinerario)!="{}"){
          //console.log(getDatosItinerario);
          this.StorageDatosItinerario = getDatosItinerario;

          this.datos = getDatosItinerario['listaIdaDisponibles'];
          //console.log(getDatosItinerario['listaIdaDisponibles']);
          this.listaIdaDisponibles = getDatosItinerario['listaIdaDisponibles'];
          this.listaVueltaDisponibles = getDatosItinerario['listaVueltaDisponibles'];
          this.ida_vuelta = getDatosItinerario['ida_vuelta'];

          this.nombre_ciudad_origen = getDatosItinerario['nombre_ciudad_origen'];
          this.nombre_ciudad_destino = getDatosItinerario['nombre_ciudad_destino'];
          this.fecha_ida = this.convert_format_fecha_guion_a_barra(getDatosItinerario['nombre_fecha_ida']);
        }

        this.nombre_fecha_hoy = this.convert_nom_fecha(this.date_actual);
        this.hora_actual = this.getHoraActual();

        setInterval(() => { this.hora_actual = this.getHoraActual(); }, 500);

        this.direccion_embarque = getDatosItinerario['listaIdaDisponibles'][0]['direccionEmbarque'];
        this.direccion_desembarque = getDatosItinerario['listaIdaDisponibles'][0]['direccionDesembarque'];

        $(".loader").fadeOut("slow");
      });
    }
  }

  select_servicio(idCard: any, datos: any){
    if(isPlatformBrowser(this.platformId)){
      this.quitar_classes_card();
      
      $("#"+idCard).toggleClass("card_seleccionado");

      if(this.itinerario_seleccionado == datos){
        $("#btn_siguiente").css("transform", "scale(1.08)");
      }
      
      this.itinerario_seleccionado = datos;

      if(this.itinerario_seleccionado.length != 0){
        $('#btn_siguiente').css('display', 'flex');
      }else{
        $('#btn_siguiente').css('display', 'none');
      }

      setTimeout(() => {
        $("#btn_siguiente").css("transform", "scale(1)");
      }, 400);
    }
  }

  quitar_classes_card(){
    for(var a=0; a<this.datos.length; a++){
      $("#card_"+this.datos[a]['iditinerario']+"_"+this.datos[a]['idAgeEmbarque']+"_"+this.datos[a]['idAgeDesembarque']).removeClass("card_seleccionado");
    }
  }

  ir_seleccionar_asientos_ida(){
    this.router.navigate(['asientos']);
  }

  select_filter(id: number){
    if(isPlatformBrowser(this.platformId)){
      $(".loader").fadeIn("slow");

      $("#mas_"+id).toggleClass("btn-principal btn-principal-active");
      
      if(id == 1){                     // MÁS BARATO
        this.datos.sort((a, b) => a.precioMinimo - b.precioMinimo);
      }else if(id == 2){               // MÁS RÁPIDO
        this.datos.sort((a, b) => a.duracionViaje - b.duracionViaje);
      }else if(id == 3){               // MÁS TEMPRANO
        this.datos.sort((a, b) => Number(a.horaEmbarque.split(":")[0] + a.horaEmbarque.split(":")[1]) - Number(b.horaEmbarque.split(":")[0] + b.horaEmbarque.split(":")[1]));
      }else if(id == 4){               // MÁS TARDE
        this.datos.sort((a, b) => Number(b.horaEmbarque.split(":")[0] + b.horaEmbarque.split(":")[1]) - Number(a.horaEmbarque.split(":")[0] + a.horaEmbarque.split(":")[1]));
      }
      
      for(var a=1; a<5; a++){
        if($('#mas_'+a).hasClass('btn-principal-active') && a!=id){
          $("#mas_"+a).toggleClass("btn-principal-active btn-principal");
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

  atras(){
    this.router.navigate(['seleccion']);
  }

  siguiente(){
    if(this.itinerario_seleccionado == ""){
      this.notificacion_mensajes("Warning", "Debe seleccionar un Itinerario para poder continuar.");
    }else{
      $(".loader").fadeIn("slow");

      var dat = {
        "nombre_ciudad_origen": this.StorageDatosItinerario['nombre_ciudad_origen'],
        "nombre_ciudad_destino": this.StorageDatosItinerario['nombre_ciudad_destino'],
        "fechaEmbarqueIda": this.itinerario_seleccionado['fechaEmbarque'],
        "fechaEmbarqueVuelta": this.StorageDatosItinerario['nombre_fecha_vuelta'],
        "fechaDesembarqueIda": this.itinerario_seleccionado['fechaDesembarque'],
        "horaEmbarqueIda": this.itinerario_seleccionado['horaEmbarque'],
        "horaDesembarqueIda": this.itinerario_seleccionado['horaDesembarque'],
        "agenciaEmbarqueIda": this.itinerario_seleccionado['ageEmbarque'],
        "agenciaDesembarqueIda": this.itinerario_seleccionado['ageDesembarque'],
        "direccionEmbarqueIda": this.itinerario_seleccionado['direccionEmbarque'],
        "direccionDesembarqueIda": this.itinerario_seleccionado['direccionDesembarque'],
        "idAgenciaEmbarqueIda": this.itinerario_seleccionado['idAgeEmbarque'],
        "idAgenciaDesembarqueIda": this.itinerario_seleccionado['idAgeDesembarque'],
        "idServicioIda": this.itinerario_seleccionado['idServicio'],
        "servicioIda": this.itinerario_seleccionado['servicio'],
        "idItinerarioIda": this.itinerario_seleccionado['iditinerario'],
        "idRutaIda": this.itinerario_seleccionado['idruta'],
        "listaIdaDisponibles": this.StorageDatosItinerario['listaIdaDisponibles'],
        "listaVueltaDisponibles": this.StorageDatosItinerario['listaVueltaDisponibles'],
        "ida_vuelta": this.StorageDatosItinerario['ida_vuelta']
      };

      localStorage.setItem("StorageDatosDetalleItinerarioIda", JSON.stringify(dat));

      this.ir_seleccionar_asientos_ida();
    }
  }

  ir_al_home(){
    this.router.navigate(['']);
  }

  verificarFechaConsulta(fechaConsulta: string){
    var part = fechaConsulta.split("-");
    //var anio = part[0]; 
    var mes = part[1];
    //var dia = part[2];

    if(mes=="07" || mes=="7"){
      return 1;
    }else{
      return 0;
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

  getHoraActual(){
    if(isPlatformBrowser(this.platformId)){
      let date = new Date();

      var hora = date.getHours();
      var minutos = date.getMinutes();
      var nom_hora, nom_minutos, am_pm;

      if(hora < 10){
        nom_hora = "0" + hora;
      }else{
        nom_hora = hora;
      }

      if(minutos < 10){
        nom_minutos = "0" + minutos;
      }else{
        nom_minutos = minutos;
      }

      if(hora >= 12){
        am_pm = "PM";
      }else{
        am_pm = "AM";
      }

      return nom_hora + ":" + nom_minutos + " " + am_pm;
    }

    return "";
  }

  duracion_viaje_detalle(fechaEmbarque: string, horaEmbarque: string, fechaDesembarque: string, horaDesembarque: string){
    if(fechaEmbarque == fechaDesembarque){
      var hora1: any = (horaDesembarque).split(":");
      var hora2: any = (horaEmbarque).split(":");
      var t1 = new Date();
      var t2 = new Date();

      t1.setHours(hora1[0], hora1[1]);
      t2.setHours(hora2[0], hora2[1]);
      
      //Aquí hago la resta
      t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes());
          
      return t1.getHours() + (t1.getMinutes() ? ":" + t1.getMinutes() : "");
    }else{
      var hora1: any = ("00:00").split(":");
      var hora2: any = (horaEmbarque).split(":");
      var t1 = new Date();
      var t2 = new Date();
  
      t1.setHours(hora1[0], hora1[1]);
      t2.setHours(hora2[0], hora2[1]);
      
      //Aquí hago la resta
      t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes());
      var data1 = t1.getHours() + (t1.getMinutes() ? ":" + t1.getMinutes(): ":00");

      var hora1: any = (horaDesembarque).split(":");
      var hora2: any = ("00:00").split(":");
      var t1 = new Date();
      var t2 = new Date();
  
      t1.setHours(hora1[0], hora1[1]);
      t2.setHours(hora2[0], hora2[1]);
      
      //Aquí hago la resta
      t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes());
      var data2 = t1.getHours() + (t1.getMinutes() ? ":" + t1.getMinutes(): ":00");

      return this.sumaDeHoras(data1, data2);
    }
  }

  sumaDeHoras(data1: string, data2: string){
    var time1 = data1.split(':');
    var time2 = data2.split(':');
    
    var valMinSum = "";
    var minSum = Number(time1[1]) + Number(time2[1]);
    var horSum = Number(time1[0]) + Number(time2[0]);
    
    if(minSum > 59){
      minSum = Math.abs(60 - minSum);
      horSum += 1;
    }
    
    if(minSum < 10){
      minSum = minSum;
    }
    
    if(horSum < 10){
      horSum = horSum;
    }
    
    if(minSum == 0){
      valMinSum = "00";
    }else{
      valMinSum = String(minSum);
    }

    return horSum+":"+valMinSum;
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

  verificar_punto(precioMinimo: any){
    var precio_minimo = String(precioMinimo);
    if(precio_minimo.includes('.')){
      return 1;
    }else{
      return 2;
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