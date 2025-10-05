import { Component, OnInit, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { AppComponent } from '../app.component';

declare var $:any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  fechaLiquidacion: string = "";
  tituloMensajeAlerta: string = "";
  textoMensajeAlerta: string = "";

  getSesionConfiguracion: any;

  date!: Date;
  date_hoy!: string;
  date_hora!: string;

  elem: any;
  openScreen: number = 0;

  cont_mayuscula: number = 0;
  texto_id: string = "";

  constructor(private router:Router, private taskService: TaskService, @Inject(PLATFORM_ID) private platformId: Object, @Inject(DOCUMENT) private document: any, public appComponent: AppComponent){

  }

  ngOnInit(): void {
    $(".loader").fadeOut("slow");
    $(".loader2").fadeOut("slow");
    localStorage.setItem("StorageDatosItinerario", JSON.stringify({}));
    //this.getSesionConfiguracion = JSON.parse(localStorage.getItem('StorageSesionConfiguracion') || '{}');
    this.verificarSesionConfiguracion();
    
    // ? ************************************ LIQUIDACION ************************************
    let getDatosConfiguracion = JSON.parse(localStorage.getItem('StorageDatosConfiguracion') || '{}');
    //console.log(getDatosConfiguracion);
    if(JSON.stringify(getDatosConfiguracion)!="{}"){
      this.taskService.getVerificarCajaAbierta(getDatosConfiguracion['idUsuarioSispas'], getDatosConfiguracion['codAgenciaOrigen']).subscribe(responseVerificarCajaAbierta=> {
        if(responseVerificarCajaAbierta['result'] == true){                 // TODO: BIEN!!
          this.fechaLiquidacion = responseVerificarCajaAbierta['mensaje'];
        }
      });
    }

    this.elem = document.documentElement;

    this.appComponent.clearInterval();
  }

  verificarSesionConfiguracion(){
    this.getSesionConfiguracion = JSON.parse(localStorage.getItem('StorageSesionConfiguracion') || '{}');
    //console.log(this.getSesionConfiguracion);
    if(JSON.stringify(this.getSesionConfiguracion)!="{}"){
      if(Number(this.getSesionConfiguracion['fecha']) == Number(this.getDateHoy())){
        if(Number(this.getSesionConfiguracion['hora']) < Number(this.getHoraHoy())){
          localStorage.setItem("StorageSesionConfiguracion", JSON.stringify({}));
        }
      }else{
        localStorage.setItem("StorageSesionConfiguracion", JSON.stringify({}));
      }
    }
  }

  ir_seleccion(){
    $(".loader").fadeIn("slow");
    if(this.fechaLiquidacion != ""){
      this.router.navigate(['seleccion']);
    }else{
      //MENSAJE DE ALERTA DE LIQUIDACION
      $(".loader").fadeOut("slow");
      this.notificacion_mensajes_alerta("Error", "Debe tener una liquidación abierta.");
    }
  }

  ir_reimprimir_boletos(){
    $(".loader").fadeIn("slow");
    this.router.navigate(['reimprimir-boletos']);
  }

  ir_enviar_pdf_correo(){
    $(".loader2").fadeIn("slow");
    this.router.navigate(['enviar-pdf-correo']);
  }

  abrir_configuracion(){
    if(JSON.stringify(this.getSesionConfiguracion)!="{}"){
      this.router.navigate(['configuracion']);
    }else{
      //VENTANA PARA COLOCAR LA CONTRASEÑA
      this.mostrar_modal("modal_mensajepassword");
    }
  }

  ir_configuracion(){
    $(".loader2").fadeIn("slow");
    $('#password_login_autoservicio').removeClass("input_login_error");

    if($('#password_login_autoservicio').val().trim() == "Movil2025$"){
      $("#teclado_alfanumerico").css("display", "none");

      var sesionConfiguracion = {
        "fecha": this.getDateHoy(),
        "hora": this.getHoraConfiguracion()
      }

      localStorage.setItem("StorageSesionConfiguracion", JSON.stringify(sesionConfiguracion));

      $(".loader2").fadeOut("slow");
      this.ocultar_modal("modal_mensajepassword");
      this.router.navigate(['configuracion']);
    }else{
      $(".loader2").fadeOut("slow");
      $('#password_login_autoservicio').addClass("input_login_error");
    }
  }

  getDateHoy(){
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

    return anio + mes + dia;
  }

  getHoraConfiguracion(){
    this.date = new Date();

    var minutos = "";
    if(Number(this.date.getMinutes()) < 10){
      minutos = "0"+ Number(this.date.getMinutes());
    }else{
      minutos = String(this.date.getMinutes()+40);
    }

    return String(this.date.getHours()) + minutos;
  }

  getHoraHoy(){
    this.date = new Date();

    var minutos = "";
    if(Number(this.date.getMinutes()) < 10){
      minutos = "0"+ Number(this.date.getMinutes());
    }else{
      minutos = String(this.date.getMinutes());
    }

    return String(this.date.getHours()) + minutos;
  }

  notificacion_mensajes_alerta(titulo: string, mensaje: string){
    this.tituloMensajeAlerta = titulo;
    this.textoMensajeAlerta = mensaje;

    this.mostrar_modal("modal_mensajealerta");
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

  ocultar_teclados(){
    $("#teclado_alfanumerico").css("display", "none");
  }

  activar_teclado_alfanumerico_password(id: string, formato: number){
    setTimeout(() => {
      this.texto_id = id;
      if(formato == 1){
        $("#teclado_alfanumerico").css("display", "flex");
        $('#teclado_alfanumerico').css({
          position: 'absolute',
          top: '54%',
          left: '28%'
        });
      }else if(formato == 2){
        $("#teclado_alfanumerico").css("display", "flex");
        $('#teclado_alfanumerico').css({
          position: 'absolute',
          top: '59%',
          left: '28%'
        });
      }
    }, 250);
  }

  click_boton(letra_numero: string){
    $("#"+this.texto_id).val();
    if(letra_numero == "borrar"){
      if($("#"+this.texto_id).val() != ""){
        $("#"+this.texto_id).val($("#"+this.texto_id).val().substring(0, $("#"+this.texto_id).val().length - 1));
      }
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

  toggleFullscreen(){
    if(this.openScreen == 1) {
      //this.closeFullscreen();
      $("#password_salir_pantalla").val("");
      this.mostrar_modal("modalPreguntaSalirPantalla");
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
    $(".loader2").fadeIn("slow");
    $('#password_salir_pantalla').removeClass("input_login_error");

    if($('#password_salir_pantalla').val().trim() == "Movil2025$"){
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
      this.ocultar_modal("modalPreguntaSalirPantalla");
      $(".loader2").fadeOut("slow");
    }else{
      $(".loader2").fadeOut("slow");
      $('#password_salir_pantalla').addClass("input_login_error");
    }
  }
}