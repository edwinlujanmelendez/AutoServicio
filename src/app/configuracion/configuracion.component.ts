import { Component, OnInit, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { TaskService } from '../services/task.service';
import { SharedService } from '../shared.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { DOCUMENT } from '@angular/common';

declare var $:any;

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {

  sub_titulo: string = "Configuración";

  agencia_origen: string = "AGENCIA ORIGEN";
  idUsuarioSispas: number = 0;
  usuario_sispas: string = "USUARIO SISPAS";
  cantidad_asientos_select: number = 0;

  seleccion: string = "";
  ltLocalidadOrigen: any;
  codLocalidadOrigen: number = 0;
  codAgenciaOrigen: number = 0;
  nombre_agencia_origen: string = "";
  ltUsuariosSispas: any;

  idUsuario: number = 0;
  idAgencia: number = 0;

  nroAnydesk: string = "";
  passwordAnydesk: string = "";
  nombrePc: string = "";
  ipv4: string = "";
  sistemaOperativo: string = "";
  usuarioAdministrador: string = "";

  elem: any;
  openScreen: number = 0;

  cont_mayuscula: number = 0;
  texto_id: string = "";

  jsonCerrarCaja: any;

  constructor(private taskService: TaskService, private router:Router, private sharedService:SharedService, @Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient, @Inject(DOCUMENT) private document: any) { }

  ngOnInit(): void {
    this.elem = document.documentElement;
  }

  ngAfterViewInit(){
    // ? SI HAY UN STORAGE *******************************************************************************************

    let getSesionConfiguracion = JSON.parse(localStorage.getItem('StorageSesionConfiguracion') || '{}');
    if(JSON.stringify(getSesionConfiguracion)=="{}"){
      this.router.navigate(['']);
    }

    let getDatosConfiguracion = JSON.parse(localStorage.getItem('StorageDatosConfiguracion') || '{}');
    if(JSON.stringify(getDatosConfiguracion)!="{}"){
      if(this.ltLocalidadOrigen == undefined){
        this.taskService.getLocalidad().subscribe(responseLocalidad => {
          this.ltLocalidadOrigen = this.ordernarLocalidades(responseLocalidad);
        });
      }

      $("#div_informacion_caja").css("display", "inline");
      /*$("#div_agencia_origen").css("display", "none");
      $("#div_usuario_sispas").css("display", "none");
      $("#div_cantidad_asientos_select").css("display", "none");*/

      this.codAgenciaOrigen = getDatosConfiguracion['codAgenciaOrigen'];
      this.codLocalidadOrigen = getDatosConfiguracion['codLocalidadOrigen'];
      this.nombre_agencia_origen = getDatosConfiguracion['nombre_agencia_origen'];
      this.agencia_origen = getDatosConfiguracion['nombre_agencia_origen'];
      this.idUsuarioSispas = getDatosConfiguracion['idUsuarioSispas'];
      this.usuario_sispas = getDatosConfiguracion['usuario_sispas'];
      this.cantidad_asientos_select = getDatosConfiguracion['cantidad_asientos_select'];
      this.nroAnydesk = getDatosConfiguracion['nroAnydesk'];
      this.passwordAnydesk = getDatosConfiguracion['passwordAnydesk'];
      this.nombrePc = getDatosConfiguracion['nombrePc'];
      this.ipv4 = getDatosConfiguracion['ipv4'];
      this.sistemaOperativo = getDatosConfiguracion['sistemaOperativo'];
      this.usuarioAdministrador = getDatosConfiguracion['usuarioAdministrador'];

      if(JSON.stringify(getDatosConfiguracion)=="{}"){
        this.router.navigate(['configuracion']);
      }else{
        if(getDatosConfiguracion['codAgenciaOrigen'] == 0 || getDatosConfiguracion['idUsuarioSispas'] == 0 || getDatosConfiguracion['cantidad_asientos_select'] == 0){
          this.router.navigate(['configuracion']);
        }else{
          //console.log(getDatosConfiguracion);
          this.idUsuario = getDatosConfiguracion['idUsuarioSispas'];
          this.idAgencia = getDatosConfiguracion['codAgenciaOrigen'];
          $("#cantidad_asientos_maximo").val(getDatosConfiguracion['cantidad_asientos_select']);
        }
      }
    }
  }

  ocultar_teclados(){
    $("#teclado_numerico").css("display", "none");
    $("#teclado_alfanumerico").css("display", "none");
  }

  activar_teclado_numerico_asientos(id: string){
    setTimeout(() => {
      this.texto_id = id;
      $("#teclado_numerico").css("display", "inline");
      $('#teclado_numerico').css({
        position: 'absolute',
        top: '52%',
        left: '39%'
      });
    }, 250);
  }

  activar_teclado_alfanumerico_password(id: string){
    setTimeout(() => {
      this.texto_id = id;
      $("#teclado_alfanumerico").css("display", "inline");
      $('#teclado_alfanumerico').css({
        position: 'absolute',
        top: '60%',
        left: '16%'
      });
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

  seleccionar_input(texto: string){
    this.seleccion = texto;
    this.quitar_classes();
    $("#"+texto).toggleClass("input_seleccionado");

    if(texto == "agencia_origen"){
      if(this.ltLocalidadOrigen == undefined){
        this.taskService.getLocalidad().subscribe(responseLocalidad => {
          this.ltLocalidadOrigen = this.ordernarLocalidades(responseLocalidad);
        });
      }

      $("#div_agencia_origen").css("display", "block");
      $("#div_usuario_sispas").css("display", "none");
      $("#div_cantidad_asientos_select").css("display", "none");
    }else if(texto == "usuario_sispas"){

      $("#div_agencia_origen").css("display", "none");
      $("#div_usuario_sispas").css("display", "inline");
      $("#div_cantidad_asientos_select").css("display", "none");
    }else if(texto == "cantidad_asientos_select"){

      $("#div_agencia_origen").css("display", "none");
      $("#div_usuario_sispas").css("display", "none");
      $("#div_cantidad_asientos_select").css("display", "inline");
    }
  }

  seleccionar_agencia_origen(id: number, denominacion: string){
    this.codLocalidadOrigen = id;
    this.codAgenciaOrigen = id;
    this.nombre_agencia_origen = denominacion;

    this.agencia_origen = denominacion;

    this.usuario_sispas = "";
    this.ltUsuariosSispas = [];
    
    this.taskService.getUsuariosSispas(id).subscribe(responseUsuariosSispas => {
      //console.log(responseUsuariosSispas);
      this.ltUsuariosSispas = responseUsuariosSispas;
    });
  }

  verificar_usuario(){
    $("#teclado_alfanumerico").css("display", "none");

    this.usuario_sispas = "";
    this.codAgenciaOrigen = 0;
    var usuario = $('#select_usuario_sispas').val();
    var password = $('#password_usuario_sispas').val();

    $("#icon_cargando").css("display", "inline");
    this.taskService.validarUsuarioSispas(usuario, password).subscribe(responseIdAgencia => {
      $("#icon_cargando").css("display", "none");

      if(Number(responseIdAgencia) != 0){             // TODO: CORRECTO 
        $("#icon_correcto").css("display", "inline");
        this.usuario_sispas = usuario;
        this.taskService.getIdUsuarioSispas(usuario).subscribe(responseIdUsuarioSispas => {
          this.idUsuarioSispas = Number(responseIdUsuarioSispas);
        });
        this.codAgenciaOrigen = Number(responseIdAgencia);
      }else{                                          // ! ERROR
        $("#icon_error").css("display", "inline");
        console.log("error");
      }

      setTimeout(() => {
        $("#icon_correcto").css("display", "none");
        $("#icon_error").css("display", "none");
      }, 2500);
    });
  }

  guardar_informacion(){
    $("#teclado_numerico").css("display", "none");
    $("#teclado_alfanumerico").css("display", "none");

    $(".loader").fadeIn("slow");

    this.quitar_classes();

    this.cantidad_asientos_select = $("#cantidad_asientos_maximo").val();

    if(this.codAgenciaOrigen != 0 && this.nombre_agencia_origen != "" && this.idUsuarioSispas != 0 && this.usuario_sispas != "USUARIO SISPAS" && this.cantidad_asientos_select > 0){
      var datosConfiguracion = {
        "codLocalidadOrigen": this.codLocalidadOrigen,
        "codAgenciaOrigen": this.codAgenciaOrigen,
        "nombre_agencia_origen": this.nombre_agencia_origen,
        "idUsuarioSispas": this.idUsuarioSispas,
        "usuario_sispas": this.usuario_sispas,
        "cantidad_asientos_select": this.cantidad_asientos_select,
        "nroAnydesk": this.nroAnydesk,
        "passwordAnydesk": this.passwordAnydesk,
        "nombrePc": this.nombrePc,
        "ipv4": this.ipv4,
        "sistemaOperativo": this.sistemaOperativo,
        "usuarioAdministrador": this.usuarioAdministrador
      }

      localStorage.setItem("StorageDatosConfiguracion", JSON.stringify(datosConfiguracion));
      $("#btn_guardar_informacion").css("background-color", "#198754");
      setTimeout(() => {
        $("#btn_guardar_informacion").css("background-color", "#ff641c");
        $(".loader").fadeOut("slow");

        this.router.navigate(['']);
      }, 2500);
    }else{
      $(".loader").fadeOut("slow");
      $("#btn_guardar_informacion").css("background-color", "#e50f0f");
    }
  }

  btn_pos_init(){
    $(".loader").fadeIn("slow");
    $("#div_informacion_caja").css("display", "none");
    $("#div_pos_init").css("display", "inline");
    $("#div_pos_echo").css("display", "none");
    $("#div_pos_cierre").css("display", "none");
    $("#div_informacion_pc").css("display", "none");

    $('#txt_api_pos_init').val("http://localhost:8080/pcl/init");

    this.taskService.getInit().subscribe(responsegetInit=> {
      $('#textarea_api_pos_init').val(JSON.stringify(responsegetInit));
      $(".loader").fadeOut("slow");
    });
  }

  btn_pos_echo(){
    $(".loader").fadeIn("slow");
    $("#div_informacion_caja").css("display", "none");
    $("#div_pos_init").css("display", "none");
    $("#div_pos_echo").css("display", "inline");
    $("#div_pos_cierre").css("display", "none");
    $("#div_informacion_pc").css("display", "none");

    $('#txt_api_pos_echo').val("http://localhost:8080/pcl/echo");

    this.taskService.getEcho().subscribe(responsegetEcho=> {
      $('#textarea_api_pos_echo').val(JSON.stringify(responsegetEcho));
      $(".loader").fadeOut("slow");
    });
  }

  btn_pos_cierre(){
    //MUESTRA MODAL DE PREGUNTA DE CIERRE DE CAJA
    this.mostrar_modal("modal_preguntaCaja");
  }
  
  cerrar_caja(){
    this.ocultar_modal("modal_preguntaCaja");

    $(".loader").fadeIn("slow");
    $("#div_informacion_caja").css("display", "none");
    $("#div_pos_init").css("display", "none");
    $("#div_pos_echo").css("display", "none");
    $("#div_pos_cierre").css("display", "inline");
    $("#div_informacion_pc").css("display", "none");
    $("#div_button_json_cerrar_caja").css("display", "none");

    $('#txt_api_pos_cierre').val("http://localhost:8080/pcl/batch");

    this.jsonCerrarCaja = "";

    this.taskService.getVerificarCajaAbierta(this.idUsuario, this.idAgencia).subscribe(responseVerificarCajaAbierta=> {
      // ? 0:Caja Cerrada - 1:Caja Abierta
      //console.log(responseVerificarCajaAbierta);
      if(responseVerificarCajaAbierta['result'] == false){
        this.taskService.getCierre().subscribe(responseCierre=> {
          $('#textarea_api_pos_cierre').val(JSON.stringify(responseCierre));
          
          var jsonArray = {
            voucherClient: responseCierre['report']
          }

          this.jsonCerrarCaja = jsonArray;
          
          const blob = new Blob([JSON.stringify(jsonArray)], { type: 'application/octet-stream' });
          saveAs(blob, "4C608A6XX.json");

          $(".loader").fadeOut("slow");
          $("#div_button_json_cerrar_caja").css("display", "inline");
        });
      }else{
        $(".loader").fadeOut("slow");
        this.mostrar_modal("modal_cajaAbierta");
      }
    });
  }

  reimprimir_json_cerrar_caja(){
    //if(this.jsonCerrarCaja != ""){
      $(".loader").fadeIn("slow");
      const blob = new Blob([JSON.stringify(this.jsonCerrarCaja)], { type: 'application/octet-stream' });
      saveAs(blob, "4C608A6XX.json");

      $(".loader").fadeOut("slow");
    //}
  }

  btn_informacion_pc(){
    $("#div_informacion_caja").css("display", "none");
    $("#div_pos_init").css("display", "none");
    $("#div_pos_echo").css("display", "none");
    $("#div_pos_cierre").css("display", "none");
    $("#div_informacion_pc").css("display", "inline");
  }

  regresar_configuracion_basica(){
    $("#div_vista_configuracion").css("display", "none");
    $("#div_vista_configuracion_avanzada").css("display", "flex");
  }

  btn_configuracion_avanzada(){
    $("#div_vista_configuracion").css("display", "flex");
    $("#div_vista_configuracion_avanzada").css("display", "none");
  }

  btn_salir_del_sistema(){
    setTimeout(() => window.close(), 200);
  }

  btn_informacion_caja(){
    this.quitar_classes();

    $("#div_informacion_caja").css("display", "inline");
    $("#div_pos_init").css("display", "none");
    $("#div_pos_echo").css("display", "none");
    $("#div_pos_cierre").css("display", "none");
    $("#div_informacion_pc").css("display", "none");
  }

  btn_probar_impresora(){
    this.quitar_classes();
    this.http.get('assets/archivo_prueba_impresion.txt', { responseType: 'text' }).subscribe(data => {
      $(".loader").fadeIn("slow");

      var sliceSize = 1024;
      var byteCharacters = atob(data);
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
    });
  }

  ordernarLocalidades(responseLocalidad: any){
    var localidades = [{}];
    var id_lima = 0;

    for(var a=0; a<responseLocalidad.length; a++){
      if(responseLocalidad[a]['denominacion'] == 'LIMA'){
        id_lima = responseLocalidad[a]['id'];
      }
    }

    localidades.push({id: id_lima, denominacion: "LIMA - NICOLAS ARRIOLA"});
    localidades.push({id: id_lima, denominacion: "LIMA - TOMAS VALLE"});
    localidades.shift();

    for(var b=0; b<responseLocalidad.length; b++){
      if(responseLocalidad[b]['denominacion'] != 'LIMA'){
        localidades.push(responseLocalidad[b]);
      }
    }

    return localidades;
  }

  quitar_classes(){
    $("#agencia_origen").removeClass("input_seleccionado");
    $("#usuario_sispas").removeClass("input_seleccionado");
    $("#cantidad_asientos_select").removeClass("input_seleccionado");
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