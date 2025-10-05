import { Component, OnInit, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { TaskService } from '../services/task.service';
import { SharedService } from '../shared.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { saveAs } from 'file-saver';
import { DOCUMENT } from '@angular/common';
import { AppComponent } from '../app.component';

declare var $:any;

@Component({
  selector: 'app-resumen-compra',
  templateUrl: './resumen-compra.component.html',
  styleUrls: ['./resumen-compra.component.css']
})
export class ResumenCompraComponent implements OnInit {

  sub_titulo: string = "RESUMEN DE COMPRA";
  ida_vuelta: number = 1;

  servicioIda: string = "";
  nombre_ciudad_origen: string = "";
  nombre_ciudad_destino: string = "";
  nombreFechaIda: string = "";
  horaEmbarqueIda: string = "";
  horaDesembarqueIda: string = "";
  direccionEmbarqueIda: string = "";
  direccionDesembarqueIda: string = "";
  num_asientos_ida_p1: string = "";
  num_asientos_ida_p2: string = "";
  precio_ida_total: number = 0;

  servicioVuelta: string = "";
  nombreFechaVuelta: string = "";
  horaEmbarqueVuelta: string = "";
  horaDesembarqueVuelta: string = "";
  direccionEmbarqueVuelta: string = "";
  direccionDesembarqueVuelta: string = "";
  num_asientos_vuelta_p1: string = "";
  num_asientos_vuelta_p2: string = "";
  precio_vuelta_total: number = 0;
  num_asientos_vuelta: string = "";

  email_contacto_pasajero: string = "";
  precio_total: number = 0;

  /*horaSalidaIda: string = "";
  horaLlegadaIda: string = "";
  direccionEmbarqueIda: string = "";
  direccionDesembarqueIda: string = "";
  nroAsientosIda: string = "";
  montoTotalIda: number = 0;*/

  elem: any;
  openScreen: number = 0;
  
  constructor(private router:Router, @Inject(DOCUMENT) private document: any, public appComponent: AppComponent) { }

  ngOnInit(): void {
    this.elem = document.documentElement;
    this.appComponent.clearInterval();
    //this.appComponent.temporizador(1, 10);
  }

  ngAfterViewInit(){
    let getResumenCompra1 = JSON.parse(localStorage.getItem('StorageResumenCompra1') || '{}');
    let getResumenCompra2 = JSON.parse(localStorage.getItem('StorageResumenCompra2') || '{}');
    
    if(JSON.stringify(getResumenCompra1)!="{}"){
      //console.log(getResumenCompra1);
      //console.log(getResumenCompra2);

      if(getResumenCompra1['numAsientosVuelta'] == ""){this.ida_vuelta=1;}else{this.ida_vuelta=2}

      this.servicioIda = getResumenCompra1['servicioIda'];
      this.nombre_ciudad_origen = getResumenCompra1['nombre_ciudad_origen'];
      this.nombre_ciudad_destino = getResumenCompra1['nombre_ciudad_destino'];
      this.nombreFechaIda = this.convert_nom_fecha(this.voltear_fecha(this.change_format_fecha_barra(getResumenCompra1['fechaEmbarqueIda'])));
      this.horaEmbarqueIda = getResumenCompra1['horaEmbarqueIda'];
      this.horaDesembarqueIda = getResumenCompra1['horaDesembarqueIda'];
      this.direccionEmbarqueIda = getResumenCompra1['direccionEmbarqueIda'];
      this.direccionDesembarqueIda = getResumenCompra1['direccionDesembarqueIda'];
      this.num_asientos_ida_p1 = getResumenCompra1['numAsientosIdaP1'];
      this.num_asientos_ida_p2 = getResumenCompra1['numAsientosIdaP2'];

      //for(var a=0; a<getResumenCompra1['precioAsientosIda'].length; a++){
      //  this.precio_ida_total = this.precio_ida_total + Number(getResumenCompra1['precioAsientosIda'][a]);
      //}

      this.servicioVuelta = getResumenCompra1['servicioVuelta'];
      this.nombreFechaVuelta = this.convert_nom_fecha(this.voltear_fecha(this.change_format_fecha_barra(getResumenCompra1['fechaEmbarqueVuelta'])));
      this.horaEmbarqueVuelta = getResumenCompra1['horaEmbarqueVuelta'];
      this.direccionEmbarqueVuelta = getResumenCompra1['direccionEmbarqueVuelta'];
      this.horaDesembarqueVuelta = getResumenCompra1['horaDesembarqueVuelta'];
      this.direccionDesembarqueVuelta = getResumenCompra1['direccionDesembarqueVuelta'];
      this.num_asientos_vuelta_p1 = getResumenCompra1['numAsientosVueltaP1'];
      this.num_asientos_vuelta_p2 = getResumenCompra1['numAsientosVueltaP2'];

      //for(var a=0; a<getResumenCompra1['precioAsientosVuelta'].length; a++){
      //  this.precio_vuelta_total = this.precio_vuelta_total + Number(getResumenCompra1['precioAsientosVuelta'][a]);
      //}

      //this.precio_total = this.precio_ida_total + this.precio_vuelta_total;
      
      this.email_contacto_pasajero = getResumenCompra2['ventaPasajeros'][0]['ventaIda']['emailContacto'];
      this.precio_total = getResumenCompra2['montoTotal'];

      //this.imprimir_boleto();

      setTimeout(() => {
        this.router.navigate(['']);
      }, 300000);
    }
  }

  no_imprimir_boleto(){
    $("#btn_pregunta_imprimir").css("display", "none");
    $("#btn_ir_inicio").css("display", "inline");
  }

  imprimir_boleto(){
    let getPDFImprimir = JSON.parse(localStorage.getItem('StoragePDFImprimir') || '{}');
        
    if(JSON.stringify(getPDFImprimir)!="{}"){
      $(".loader").fadeIn("slow");

      var sliceSize = 1024;
      var byteCharacters = atob(getPDFImprimir);
      var byteArrays: any[] = [];

      for(var offset = 0; offset < byteCharacters.length; offset += sliceSize){
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for(var i = 0; i < slice.length; i++){
          byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
      }

      var blob = new Blob(byteArrays, { type: 'application/octet-stream' });
      saveAs(blob, '4C608A6BF.zip');

      //$("#btn_pregunta_imprimir").css("display", "none");
      $("#btn_ir_inicio").css("display", "inline");

      $(".loader").fadeOut("slow");
    }
  }

  voltear_fecha(fecha: string){
    var part = fecha.split("/");
    var dia = String(part[0])
    var mes = String(part[1])
    var anio = String(part[2]);

    return anio+"/"+mes+"/"+dia;
  }

  convert_nom_fecha(fecha: string){
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

  change_format_fecha_barra(fecha: string){
    var part = fecha.split("-");
    var dia = String(part[2])
    var mes = String(part[1])
    var anio = String(part[0]);

    return dia+"/"+mes+"/"+anio;
  }

  regresar_home(){
    localStorage.setItem("StorageDatosPasajeros", JSON.stringify({}));
    localStorage.setItem("StorageResumenCompra", JSON.stringify({}));
    localStorage.setItem("StoragePDFImprimir", JSON.stringify({}));
    
    this.router.navigate(['']);
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
