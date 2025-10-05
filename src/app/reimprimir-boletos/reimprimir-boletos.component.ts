import { Component, OnInit, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { TaskService } from '../services/task.service';
import { SharedService } from '../shared.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { saveAs } from 'file-saver';
import { DOCUMENT } from '@angular/common';

declare var $:any;

@Component({
  selector: 'app-reimprimir-boletos',
  templateUrl: './reimprimir-boletos.component.html',
  styleUrls: ['./reimprimir-boletos.component.css']
})
export class ReimprimirBoletosComponent implements OnInit {

  sub_titulo: string = "Reimprimir Boletos";

  date!: Date;
  date_actual: string = "";
  date_actual_barra: string = "";

  numero_documento: string = "";
  limite_maximo_numero_documento: number = 8;
  texto_mensaje_alerta: string = "";
  tipo_entrada_teclado: string = "NUMERICO";    //NUMERICO
  val_buscar_boletos: number = 0;
  nombre_fecha_hoy: string = "";
  hora_actual: string = "";

  lstDatosLista: any = [];

  elem: any;
  openScreen: number = 0;

  constructor(private taskService: TaskService, private router:Router, private sharedService:SharedService, @Inject(PLATFORM_ID) private platformId: Object, @Inject(DOCUMENT) private document: any){
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

    this.date_actual = anio + "-" + mes + "-" + dia;
    this.date_actual_barra = dia + "/" + mes + "/" + anio;
  }

  ngOnInit(): void {
    this.elem = document.documentElement;
  }

  ngAfterViewInit(){
    $(".loader").fadeOut("slow");
    $("#vista_ingresar_datos").css("display", "inline");
    $("#vista_mostrar_datos").css("display", "none");
    $("#grupo_botones_center").css("display", "none");
    $("#btn_buscar_boletos").css("display", "inline");
    $('#dni').prop("checked", true);

    this.nombre_fecha_hoy = this.convert_nom_fecha(this.date_actual);
    this.hora_actual = this.getHoraActual();

    setInterval(() => { this.hora_actual = this.getHoraActual(); }, 500);
  }

  atras(){
    $(".loader").fadeIn("slow");
    this.router.navigate(['']);
  }

  nueva_consulta(){
    $(".loader").fadeIn("slow");
    $("#btn_atras").css("display", "inline");
    $("#vista_ingresar_datos").css("display", "inline");
    $("#vista_mostrar_datos").css("display", "none");
    $("#grupo_botones_center").css("display", "none");
    $("#btn_buscar_boletos").css("display", "inline");
    this.numero_documento = "";
    this.lstDatosLista = [];
    $(".loader").fadeOut("slow");
  }

  regresar_al_inicio(){
    $(".loader").fadeIn("slow");
    this.router.navigate(['']);
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
    }else if(textoRadioButton == "carnet_extranjeria"){
      this.limite_maximo_numero_documento = 12;
      this.tipo_entrada_teclado = "ALFANUMERICO";
      this.numero_documento = "";
      $('#chk_carnet_extranjeria').addClass("document_select");
    }else if(textoRadioButton == "pasaporte"){
      this.limite_maximo_numero_documento = 12;
      this.tipo_entrada_teclado = "ALFANUMERICO";
      this.numero_documento = "";
      $('#chk_pasaporte').addClass("document_select");
    }else if(textoRadioButton == "cedula_identidad"){
      this.limite_maximo_numero_documento = 10;
      this.tipo_entrada_teclado = "ALFANUMERICO";
      this.numero_documento = "";
      $('#chk_cedula_identidad').addClass("document_select");
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
      this.val_buscar_boletos = 1
      $('#btn_buscar_boletos').removeClass("btn_buscar_boletos_disable");
      $('#btn_buscar_boletos').addClass("btn_buscar_boletos");
    }else{
      this.val_buscar_boletos = 0;
      $('#btn_buscar_boletos').removeClass("btn_buscar_boletos");
      $('#btn_buscar_boletos').addClass("btn_buscar_boletos_disable");
    }
  }

  buscar_boletos(){
    if(this.val_buscar_boletos == 1){
      this.texto_mensaje_alerta = "";
      $(".loader").fadeIn("slow");
      this.taskService.getReimprimirBoleto(String(this.numero_documento).trim()).subscribe(responseReimprimirBoleto=> {
        //console.log(responseReimprimirBoleto);
        if(responseReimprimirBoleto.length > 0){
          for(var a=0; a<responseReimprimirBoleto.length; a++){
            var data = {
              "venpas_id": responseReimprimirBoleto[a]['venpas_id'],
              "servicio": responseReimprimirBoleto[a]['c_nomcor'],
              "fecha_partida": this.convert_format_fecha_barra(responseReimprimirBoleto[a]['d_fecpar'].replace(" 00:00:00", "")),
              "salida": responseReimprimirBoleto[a]['c_origen'],
              "destino": responseReimprimirBoleto[a]['c_destino'],
              "hora_partida": responseReimprimirBoleto[a]['c_horpar'],
              "hora_llegada": responseReimprimirBoleto[a]['c_horlle'],
              "direccion_partida": responseReimprimirBoleto[a]['direccion_salida'],
              "direccion_llegada": responseReimprimirBoleto[a]['direccion_llegada'],
              "nombres_apellidos": responseReimprimirBoleto[a]['c_nomape'],
              "boleto": responseReimprimirBoleto[a]['c_numboleto'],
              "nroasiento": responseReimprimirBoleto[a]['n_numasiento'],
              "total": responseReimprimirBoleto[a]['importe']
            };
    
            this.lstDatosLista.push(data);
          }
          
          $("#btn_atras").css("display", "none");
          $("#vista_ingresar_datos").css("display", "none");
          $("#vista_mostrar_datos").css("display", "inline");
          $("#grupo_botones_center").css("display", "flex");
          $("#btn_buscar_boletos").css("display", "none");
        }else{
          this.texto_mensaje_alerta = "* No se encontraron boletos con el DNI ingresado.";
        }
        $(".loader").fadeOut("slow");
      }, error =>{
        //! SI ES ERROR
        $(".loader").fadeOut("slow");
      }, () =>{
        
      });
    }
  }

  imprimir_boletos(venpas_id: number){
    $(".loader").fadeIn("slow");
    this.taskService.getDescargarPdf(venpas_id).subscribe(responseDescargarPdf=> {
      //console.log(responseDescargarPdf);

      var sliceSize = 1024;
      var byteCharacters = atob(responseDescargarPdf);
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

      $(".loader").fadeOut("slow");
    }, error =>{
      //! SI ES ERROR
      $(".loader").fadeOut("slow");
    }, () =>{
      
    });
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

  convert_nom_fecha(fecha: string){
    if(isPlatformBrowser(this.platformId)){
      if(fecha != ""){
        let dias = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
        let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

        let date = new Date(fecha.replace(/-+/g, '/'));

        var fechaNum = date.getDate();
        var mes_name = date.getMonth();
        
        return dias[date.getDay()] + " " + fechaNum + " de " + meses[mes_name] + " del " + date.getFullYear();
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