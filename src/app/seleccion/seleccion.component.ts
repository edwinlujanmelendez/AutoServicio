import { Component, OnInit, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { TaskService } from '../services/task.service';
import { SharedService } from '../shared.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { AppComponent } from '../app.component';

declare var $:any;

@Component({
  selector: 'app-seleccion',
  templateUrl: './seleccion.component.html',
  styleUrls: ['./seleccion.component.css']
})
export class SeleccionComponent implements OnInit {

  sub_titulo: string = "Selecciona la ciudad y fecha de viaje";
  nombre_ciudad_origen: string = "";
  nombre_ciudad_destino: string = "";
  nombre_fecha_ida: string = "";
  nombre_fecha_vuelta: string = "";

  seleccion: string = "";
  ltLocalidadOrigen: any;
  ltLocalidadDestino: any;
  codLocalidadIda: number = 0;
  codLocalidadDestino: number = 0;
  date!: Date;
  date_actual: string = "";
  date_actual_barra: string = "";

  listaIdaDisponibles: any;
  listaVueltaDisponibles: any;
  ida_vuelta: number = 1;

  val_verificar_seleccion: number = 0;

  fechaLiquidacion: string = "";
  tituloMensajeAlerta: string = "";
  textoMensajeAlerta: string = "";

  nombre_fecha_hoy: string = "";
  hora_actual: string = "";

  paso: number = 1;

  elem: any;
  openScreen: number = 0;

  constructor(private taskService: TaskService, private router:Router, private sharedService:SharedService, @Inject(PLATFORM_ID) private platformId: Object, @Inject(DOCUMENT) private document: any, public appComponent: AppComponent){
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
    this.appComponent.clearInterval();
    //this.appComponent.temporizador(5, 10);
  }

  ngAfterViewInit(){
    $(".loader").fadeOut("slow");

    // ? SI HAY UN STORAGE *******************************************************************************************
    let getDatosItinerario = JSON.parse(localStorage.getItem('StorageDatosItinerario') || '{}');
    
    if(JSON.stringify(getDatosItinerario)!="{}"){
      this.taskService.getLocalidad().subscribe(responseLocalidad => {
        this.ltLocalidadOrigen = this.ordernarLocalidades(responseLocalidad);
        //this.ltLocalidadDestino = responseLocalidad;
      });

      this.nombre_ciudad_origen = getDatosItinerario['nombre_ciudad_origen'];
      this.codLocalidadIda = getDatosItinerario['codLocalidadIda'];
      this.nombre_ciudad_destino = getDatosItinerario['nombre_ciudad_destino'];
      this.codLocalidadDestino = getDatosItinerario['codLocalidadDestino'];
      this.nombre_fecha_ida = this.convert_format_fecha_guion_a_barra(getDatosItinerario['nombre_fecha_ida']);
      
      $("#calendario1").datepicker({format: 'dd/mm/yyyy', startDate: "today"}).datepicker("update", this.nombre_fecha_ida); 

      $('#calendario2').datepicker('destroy');

      this.nombre_fecha_vuelta = "";

      $("#calendario2").datepicker({
        format: 'dd/mm/yyyy',
        beforeShowDay: this.highlightRange,
        startDate: this.nombre_fecha_ida
      });

      this.val_verificar_seleccion = 1;
      $('#button_buscar').removeClass("btn_buscar_disable");
    }else{
      // TODO: DETECTA LA CONFIGURACIÓN Y ESTABLECE POR DEFECTO EL ORIGEN ************************************************************
      this.seleccionar_input("nombre_ciudad_origen");

      setTimeout(() => {
        let getDatosConfiguracion = JSON.parse(localStorage.getItem('StorageDatosConfiguracion') || '{}');
        //console.log(getDatosConfiguracion);
        this.seleccionar_localidad_origen(getDatosConfiguracion['codLocalidadOrigen'], getDatosConfiguracion['nombre_agencia_origen'], 0);
      }, 750);
      // TODO: DETECTA LA CONFIGURACIÓN Y ESTABLECE POR DEFECTO EL ORIGEN ************************************************************
    }
    // ? SI HAY UN STORAGE *******************************************************************************************

    var that = this;

    //today
    $("#calendario1").datepicker({
      format: 'dd/mm/yyyy',
      startDate: this.date_actual_barra
    });

    //console.log($('#calendario1').datepicker('getFormattedDate'));
    //console.log($('#calendario1').datepicker('getDates'));

    $('#calendario1').on('changeDate', function(){
      that.nombre_fecha_ida = $('#calendario1').datepicker('getFormattedDate');
      that.nombre_fecha_vuelta = "";

      $('#calendario2').datepicker('destroy');

      $("#calendario2").datepicker({
        format: 'dd/mm/yyyy',
        beforeShowDay: that.highlightRange,
        startDate: $('#calendario1').datepicker('getFormattedDate')
      });

      that.verificar_seleccion();

      $("#btn_siguiente").css("display", "inline");
    });

    //today
    $("#calendario2").datepicker({
      format: 'dd/mm/yyyy',
      beforeShowDay: that.highlightRange,
      startDate: this.date_actual_barra
    });

    $('#calendario2').on('changeDate', function(){
      that.nombre_fecha_vuelta = $('#calendario2').datepicker('getFormattedDate');
    });

    // ? ************************************ LIQUIDACION ************************************
    let getDatosConfiguracion = JSON.parse(localStorage.getItem('StorageDatosConfiguracion') || '{}');
    if(JSON.stringify(getDatosConfiguracion)!="{}"){
      this.taskService.getVerificarCajaAbierta(getDatosConfiguracion['idUsuarioSispas'], getDatosConfiguracion['codAgenciaOrigen']).subscribe(responseVerificarCajaAbierta=> {
        if(responseVerificarCajaAbierta['result'] == true){                 // TODO: BIEN!!
          this.fechaLiquidacion = responseVerificarCajaAbierta['mensaje'];
        }
      });
    }

    this.nombre_fecha_hoy = this.convert_nom_fecha(this.date_actual);
    this.hora_actual = this.getHoraActual();

    setInterval(() => { this.hora_actual = this.getHoraActual(); }, 500);

    $("#btn_siguiente").css("display", "none");
  }

  ir_al_inicio(){
    this.router.navigate(['']);
  }

  ir_al_home(){
    this.router.navigate(['']);
  }

  si_viaje_retorno(){
    this.ocultar_modal("modalPreguntaRetorno");
    $("#seleccion_3").css("display", "none");
    $("#seleccion_4").css("display", "inline");
    this.paso = 4;
  }

  no_viaje_retorno(){
    this.ocultar_modal("modalPreguntaRetorno");
    this.buscar_viajes();
  }

  siguiente(){
    if(this.paso == 1){
      this.taskService.getLocalidadDestino(this.codLocalidadIda).subscribe(responseLocalidad => {
        this.ltLocalidadDestino = this.ordernarLocalidadesDestino(responseLocalidad);
      });

      $("#seleccion_1").css("display", "none");
      $("#seleccion_2").css("display", "inline");
      $("#btn_ir_al_inicio").css("display", "none");
      $("#btn_atras").css("display", "flex");
      if(this.nombre_ciudad_destino != ""){
        $("#btn_siguiente").css("display", "inline");
      }else{
        $("#btn_siguiente").css("display", "none");
      }
      this.paso = 2;
    }else if(this.paso == 2){
      $("#seleccion_2").css("display", "none");
      $("#seleccion_3").css("display", "inline");
      this.paso = 3;
    }else if(this.paso == 3){
      this.mostrar_modal("modalPreguntaRetorno");
    }else if(this.paso == 4){
      this.buscar_viajes();
    }
  }

  atras(){
    if(this.paso == 2){
      $("#seleccion_1").css("display", "inline");
      $("#seleccion_2").css("display", "none");
      $("#btn_ir_al_inicio").css("display", "flex");
      $("#btn_atras").css("display", "none");
      this.paso = 1;
    }else if(this.paso == 3){
      $("#seleccion_3").css("display", "none");
      $("#seleccion_2").css("display", "inline");
      $("#btn_atras").css("display", "flex");
      this.paso = 2;
    }else if(this.paso == 4){
      $("#seleccion_4").css("display", "none");
      $("#seleccion_3").css("display", "inline");
      this.paso = 3;
    }
  }

  highlightRange(date) {
    var selectedDates1 = $('#calendario1').datepicker('getDates');
    var selectedDates2 = $('#calendario2').datepicker('getDates');

    if(date >= selectedDates1[0] && date <= selectedDates2[0]) {
      return 'highlighted';
    }
    return '';
  }

  limpiar_fecha_vuelta(){
    var that = this;

    $('#calendario2').datepicker('destroy');

    $("#calendario2").datepicker({
      format: 'dd/mm/yyyy',
      beforeShowDay: that.highlightRange,
      startDate: $('#calendario1').datepicker('getFormattedDate')
    });

    $('#calendario2').on('changeDate', function(){
      that.nombre_fecha_vuelta = $('#calendario2').datepicker('getFormattedDate');
    });

    this.nombre_fecha_vuelta = "";
  }

  seleccionar_input(texto: string){
    this.seleccion = texto;
    this.quitar_classes();
    $("#"+texto).toggleClass("input_seleccionado");

    if(texto == "nombre_ciudad_origen"){
      if(this.ltLocalidadOrigen == undefined){
        this.taskService.getLocalidad().subscribe(responseLocalidad => {
          this.ltLocalidadOrigen = this.ordernarLocalidades(responseLocalidad);
          this.ltLocalidadDestino = responseLocalidad;
        });
      }

      /*$("#localidades_origen").css("display", "inline");
      $("#localidades_destino").css("display", "none");
      $("#div_fecha_ida").css("display", "none");
      $("#div_fecha_vuelta").css("display", "none");*/
    }else if(texto == "nombre_ciudad_destino"){
      if(this.codLocalidadIda != 0){
        this.taskService.getLocalidadDestino(this.codLocalidadIda).subscribe(responseLocalidad => {
          this.ltLocalidadDestino = this.ordernarLocalidades(responseLocalidad);
        });
      }

      /*$("#localidades_origen").css("display", "none");
      $("#localidades_destino").css("display", "inline");
      $("#div_fecha_ida").css("display", "none");
      $("#div_fecha_vuelta").css("display", "none");*/
    }else if(texto == "nombre_fecha_ida"){
      /*$("#localidades_origen").css("display", "none");
      $("#localidades_destino").css("display", "none");
      $("#div_fecha_ida").css("display", "inline");
      $("#div_fecha_vuelta").css("display", "none");*/
    }else if(texto == "nombre_fecha_vuelta"){
      /*$("#localidades_origen").css("display", "none");
      $("#localidades_destino").css("display", "none");
      $("#div_fecha_ida").css("display", "none");
      $("#div_fecha_vuelta").css("display", "inline");*/
    }
  }

  ordernarLocalidadesDestino(responseLocalidad: any){
    let StorageDatosConfiguracion = JSON.parse(localStorage.getItem('StorageDatosConfiguracion') || '{}');

    var localidades = [{}];
    var nombre_agencia_origen = StorageDatosConfiguracion['nombre_agencia_origen'];
    var nombre_agencia_seleccionado = this.nombre_ciudad_origen;

    //console.log(nombre_agencia_origen);
    
    if(!nombre_agencia_seleccionado.includes("LIMA")){
      var id_lima = 0;

      for(var a=0; a<responseLocalidad.length; a++){
        if(responseLocalidad[a]['denominacion'] == 'LIMA'){
          id_lima = responseLocalidad[a]['id'];
        }
      }

      localidades.shift();

      if(nombre_agencia_origen == "LIMA - NICOLAS ARRIOLA"){
        localidades.push({id: id_lima, denominacion: "LIMA - NICOLAS ARRIOLA"});
        localidades.push({id: id_lima, denominacion: "LIMA - TOMAS VALLE"});
      }else if(nombre_agencia_origen == "LIMA - TOMAS VALLE"){
        localidades.push({id: id_lima, denominacion: "LIMA - NICOLAS ARRIOLA"});
        localidades.push({id: id_lima, denominacion: "LIMA - TOMAS VALLE"});
      }

      //localidades.push({id: id_lima, denominacion: "LIMA - NICOLAS ARRIOLA"});
      //localidades.push({id: id_lima, denominacion: "LIMA - TOMAS VALLE"});
      //localidades.shift();

      for(var b=0; b<responseLocalidad.length; b++){
        if(responseLocalidad[b]['denominacion'] != 'LIMA'){
          localidades.push(responseLocalidad[b]);
        }
      }
    }else{
      /*var id_lima = 0;

      for(var a=0; a<responseLocalidad.length; a++){
        if(responseLocalidad[a]['denominacion'] == nombre_agencia_origen){
          id_lima = responseLocalidad[a]['id'];
        }
      }

      localidades.push({id: id_lima, denominacion: nombre_agencia_origen});*/
      localidades.shift();

      for(var b=0; b<responseLocalidad.length; b++){
        if(responseLocalidad[b]['denominacion'] != nombre_agencia_seleccionado){
          localidades.push(responseLocalidad[b]);
        }
      }
    }

    return localidades;
  }

  ordernarLocalidades(responseLocalidad: any){
    let StorageDatosConfiguracion = JSON.parse(localStorage.getItem('StorageDatosConfiguracion') || '{}');

    var localidades = [{}];
    var nombre_agencia_origen = StorageDatosConfiguracion['nombre_agencia_origen'];
    
    if(nombre_agencia_origen == "LIMA - NICOLAS ARRIOLA"){
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
    }else if(nombre_agencia_origen == "LIMA - TOMAS VALLE"){
      var id_lima = 0;

      for(var a=0; a<responseLocalidad.length; a++){
        if(responseLocalidad[a]['denominacion'] == 'LIMA'){
          id_lima = responseLocalidad[a]['id'];
        }
      }

      localidades.push({id: id_lima, denominacion: "LIMA - TOMAS VALLE"});
      localidades.push({id: id_lima, denominacion: "LIMA - NICOLAS ARRIOLA"});
      localidades.shift();

      for(var b=0; b<responseLocalidad.length; b++){
        if(responseLocalidad[b]['denominacion'] != 'LIMA'){
          localidades.push(responseLocalidad[b]);
        }
      }
    }else{
      var id_lima = 0;

      for(var a=0; a<responseLocalidad.length; a++){
        if(responseLocalidad[a]['denominacion'] == nombre_agencia_origen){
          id_lima = responseLocalidad[a]['id'];
        }
      }

      localidades.push({id: id_lima, denominacion: nombre_agencia_origen});
      localidades.shift();

      for(var b=0; b<responseLocalidad.length; b++){
        if(responseLocalidad[b]['denominacion'] != nombre_agencia_origen){
          localidades.push(responseLocalidad[b]);
        }
      }
    }

    return localidades;
  }

  seleccionar_localidad_origen(id: number, denominacion: string, posicion: number){
    this.quitarSeleccion3Origen("id_localidad_origen_");
    
    this.codLocalidadIda = id;
    this.nombre_ciudad_origen = denominacion;

    this.verificar_seleccion();
    
    $('#id_localidad_origen_'+id+'_'+posicion).addClass("input_seleccion3");

    $("#btn_siguiente").css("display", "inline");
  }

  seleccionar_localidad_destino(id: number, denominacion: string, posicion: number){
    this.quitarSeleccion3Destino("id_localidad_destino_");
    this.codLocalidadDestino = id;
    this.nombre_ciudad_destino = denominacion;

    this.verificar_seleccion();

    $('#id_localidad_destino_'+id+'_'+posicion).addClass("input_seleccion3");

    $("#btn_siguiente").css("display", "inline");
  }

  quitarSeleccion3Origen(id: string){
    for(var a=0; a<this.ltLocalidadOrigen.length; a++){
      $('#'+id+this.ltLocalidadOrigen[a]['id']+'_'+a).removeClass("input_seleccion3");
    }
  }

  quitarSeleccion3Destino(id: string){
    for(var a=0; a<this.ltLocalidadDestino.length; a++){
      $('#'+id+this.ltLocalidadDestino[a]['id']+'_'+a).removeClass("input_seleccion3");
    }
  }

  verificar_seleccion(){
    this.val_verificar_seleccion = 0;
    var contador = 0;

    if(this.codLocalidadIda == 0){
      contador++;
    }
    if(this.codLocalidadDestino == 0){
      contador++;
    }
    if(this.nombre_fecha_ida == "IDA"){
      contador++;
    }

    if(contador > 0){
      $('#button_buscar').addClass("btn_buscar_disable");
      this.val_verificar_seleccion = 0;
    }else{
      $('#button_buscar').removeClass("btn_buscar_disable");
      this.val_verificar_seleccion = 1;
    }
  }

  verificarMismoDiaPorRuta(codCiudadOrigen: any, codCiudadDestino: any){
    // TODO: Lima-Huacho, Huacho-Lima, Lima-Barranca, Barranca-Lima, Lima-Paramonga, Paramonga-Lima
    /**
     * Lima: 72
     * Huacho: 59
     * Barranca: 13
     * Paramonga: 73 
     */

    var x = 0;

    if(codCiudadOrigen == 72 && codCiudadDestino == 59){
      x = 1;
    }else if(codCiudadOrigen == 59 && codCiudadDestino == 72){
      x = 1;
    }else if(codCiudadOrigen == 72 && codCiudadDestino == 13){
      x = 1;
    }else if(codCiudadOrigen == 13 && codCiudadDestino == 72){
      x = 1;
    }else if(codCiudadOrigen == 72 && codCiudadDestino == 73){
      x = 1;
    }else if(codCiudadOrigen == 73 && codCiudadDestino == 72){
      x = 1;
    }else{
      x = 0;
    }

    return x;
  }

  buscar_viajes(){
    if(this.fechaLiquidacion != ""){
      if(this.val_verificar_seleccion == 1){
        $(".loader").fadeIn("slow");
        
        this.quitar_classes();
        if(this.nombre_fecha_vuelta == ""){ this.nombre_fecha_vuelta=""; this.ida_vuelta = 1; }else{ this.ida_vuelta=2; }

        var ida_vuelta_iguales = this.verificarMismoDiaPorRuta(this.codLocalidadIda, this.codLocalidadDestino);

        //console.log(this.codLocalidadIda);
        //console.log(this.codLocalidadDestino);

        let StorageDatosConfiguracion = JSON.parse(localStorage.getItem('StorageDatosConfiguracion') || '{}');
        //console.log(StorageDatosConfiguracion['codLocalidadOrigen']);

        //if(StorageDatosConfiguracion['codLocalidadOrigen'] == this.codLocalidadIda){
          // TODO: EL ORIGEN DE CONFIGURACION ES IGUAL AL ORIGEN DE BUSQUEDA

          this.taskService.getItinerario(this.codLocalidadIda, this.codLocalidadDestino, this.convert_format_fecha_guion(this.nombre_fecha_ida), this.convert_format_fecha_guion(this.nombre_fecha_vuelta), ida_vuelta_iguales, 0).subscribe(responseItinerario => {
            //console.log(responseItinerario);
            this.listaIdaDisponibles = [];
            this.listaVueltaDisponibles = [];
            var cont_bien = 0;
  
            if(responseItinerario['listaIdaDisponibles'] != null){

              for(var ab=0; ab<responseItinerario['listaIdaDisponibles'].length; ab++){
                responseItinerario['listaIdaDisponibles'][ab]['duracionViaje'] = this.duracion_viaje_valor(responseItinerario['listaIdaDisponibles'][ab]['horaEmbarque'], responseItinerario['listaIdaDisponibles'][ab]['horaDesembarque']);
              }

              this.listaIdaDisponibles = responseItinerario['listaIdaDisponibles'];
              cont_bien = 1;
              
              /******************************** VUELTA ********************************/
              if(this.ida_vuelta == 2 && responseItinerario['listaVueltaDisponibles'] != null){
                var newListaVueltaDisponibles = [{}];
                var nombre_filtro = "";
                if(this.nombre_ciudad_origen == "LIMA - TOMAS VALLE"){
                  nombre_filtro = "Tomas Valle";
                }else if(this.nombre_ciudad_origen == "LIMA - NICOLAS ARRIOLA"){
                  nombre_filtro = "Nicolas Arriola";
                }

                for(var a=0; a<responseItinerario['listaVueltaDisponibles'].length; a++){
                  var direccionDesembarque = String(responseItinerario['listaVueltaDisponibles'][a]['direccionDesembarque']);
                  direccionDesembarque = direccionDesembarque.replace("á", "a");
                  direccionDesembarque = direccionDesembarque.replace("é", "e");
                  direccionDesembarque = direccionDesembarque.replace("í", "i");
                  direccionDesembarque = direccionDesembarque.replace("ó", "o");
                  direccionDesembarque = direccionDesembarque.replace("ú", "u");

                  if(direccionDesembarque.includes(nombre_filtro)){
                    newListaVueltaDisponibles.push(responseItinerario['listaVueltaDisponibles'][a]);
                  }
                }

                newListaVueltaDisponibles.shift();
                
                if(newListaVueltaDisponibles.toString() != ""){
                  for(var ab=0; ab<newListaVueltaDisponibles.length; ab++){
                    newListaVueltaDisponibles[ab]['duracionViaje'] = this.duracion_viaje_valor(newListaVueltaDisponibles[ab]['horaEmbarque'], newListaVueltaDisponibles[ab]['horaDesembarque']);
                  }
  
                  this.listaVueltaDisponibles = newListaVueltaDisponibles;
                  cont_bien = 1;
                }else{
                  this.mostrar_modal("modal_not_tickets_vuelta");
                  cont_bien = 0;
                }
              }else if(this.ida_vuelta == 2 && responseItinerario['listaVueltaDisponibles'] == null){
                this.mostrar_modal("modal_not_tickets_vuelta");
                cont_bien = 0;
              }
              /******************************** VUELTA ********************************/
              
              if(cont_bien == 1){
                var newListaIdaDisponibles = [{}];
                var nombre_filtro_origen = "";
                var nombre_filtro_destino = "";

                if(this.nombre_ciudad_origen.trim() == "LIMA - TOMAS VALLE"){
                  nombre_filtro_origen = "Tomas Valle";
                }else if(this.nombre_ciudad_origen.trim() == "LIMA - NICOLAS ARRIOLA"){
                  nombre_filtro_origen = "Nicolas Arriola";
                }else if(this.nombre_ciudad_destino.trim() == "LIMA - TOMAS VALLE"){
                  nombre_filtro_destino = "Tomas Valle";
                }else if(this.nombre_ciudad_destino.trim() == "LIMA - NICOLAS ARRIOLA"){
                  nombre_filtro_destino = "Nicolas Arriola";
                }
                
                if(nombre_filtro_origen != ""){
                  for(var a=0; a<this.listaIdaDisponibles.length; a++){
                    var direccion_embarque = String(this.listaIdaDisponibles[a]['direccionEmbarque']);
                    direccion_embarque = direccion_embarque.replace("á", "a");
                    direccion_embarque = direccion_embarque.replace("é", "e");
                    direccion_embarque = direccion_embarque.replace("í", "i");
                    direccion_embarque = direccion_embarque.replace("ó", "o");
                    direccion_embarque = direccion_embarque.replace("ú", "u");
      
                    if(direccion_embarque.includes(nombre_filtro_origen)){
                      newListaIdaDisponibles.push(this.listaIdaDisponibles[a]);
                    }
                  }
                }

                if(nombre_filtro_destino != ""){
                  for(var a=0; a<this.listaIdaDisponibles.length; a++){
                    var direccion_desembarque = String(this.listaIdaDisponibles[a]['direccionDesembarque']);
  
                    direccion_desembarque = direccion_desembarque.replace("á", "a");
                    direccion_desembarque = direccion_desembarque.replace("é", "e");
                    direccion_desembarque = direccion_desembarque.replace("í", "i");
                    direccion_desembarque = direccion_desembarque.replace("ó", "o");
                    direccion_desembarque = direccion_desembarque.replace("ú", "u");
    
                    if(direccion_desembarque.includes(nombre_filtro_destino)){
                      newListaIdaDisponibles.push(this.listaIdaDisponibles[a]);
                    }
                  }
                }
  
                newListaIdaDisponibles.shift();
                this.listaIdaDisponibles = newListaIdaDisponibles;

                //console.log(newListaIdaDisponibles);
  
                if(newListaIdaDisponibles.length != 0){
                  var datosItinerario = {
                    "nombre_ciudad_origen": this.nombre_ciudad_origen,
                    "nombre_ciudad_destino": this.nombre_ciudad_destino,
                    "codLocalidadIda": this.codLocalidadIda,
                    "codLocalidadDestino": this.codLocalidadDestino,
                    "nombre_fecha_ida": this.convert_format_fecha_guion(this.nombre_fecha_ida),
                    "nombre_fecha_vuelta": this.convert_format_fecha_guion(this.nombre_fecha_vuelta),
                    "listaIdaDisponibles": newListaIdaDisponibles,
                    "listaVueltaDisponibles": this.listaVueltaDisponibles,
                    "ida_vuelta": this.ida_vuelta
                  }
              
                  localStorage.setItem("StorageDatosItinerario", JSON.stringify(datosItinerario));
              
                  if(this.nombre_fecha_vuelta == ""){this.nombre_fecha_vuelta="";};
              
                  this.ir_itinerario();
                }else{
                  this.mostrar_modal("modal_not_tickets_ida");
  
                  if(this.nombre_fecha_vuelta == ""){this.nombre_fecha_vuelta="";};
                }
              }
            }else{
              this.mostrar_modal("modal_not_tickets_ida");
            }
  
            $(".loader").fadeOut("slow");
          }, error =>{
            // ERROR
          },() =>{
            $(".loader").fadeOut("slow");
          });
        /*}else{
          // TODO: EL ORIGEN DE CONFIGURACION ES DIFERENTE AL ORIGEN DE BUSQUEDA

          this.taskService.getItinerario(this.codLocalidadIda, this.codLocalidadDestino, this.convert_format_fecha_guion(this.nombre_fecha_ida), this.convert_format_fecha_guion(this.nombre_fecha_vuelta), ida_vuelta_iguales, 0).subscribe(responseItinerario => {
            //console.log(responseItinerario);

            this.listaIdaDisponibles = [];
            this.listaVueltaDisponibles = [];
            var cont_bien = 0;
  
            if(responseItinerario['listaIdaDisponibles'] != null){
              for(var ab=0; ab<responseItinerario['listaIdaDisponibles'].length; ab++){
                responseItinerario['listaIdaDisponibles'][ab]['duracionViaje'] = this.duracion_viaje_valor(responseItinerario['listaIdaDisponibles'][ab]['horaEmbarque'], responseItinerario['listaIdaDisponibles'][ab]['horaDesembarque']);
              }

              this.listaIdaDisponibles = responseItinerario['listaIdaDisponibles'];
              cont_bien = 1;
              
              if(this.ida_vuelta == 2 && responseItinerario['listaVueltaDisponibles'] != null){
                for(var ab=0; ab<responseItinerario['listaVueltaDisponibles'].length; ab++){
                  responseItinerario['listaVueltaDisponibles'][ab]['duracionViaje'] = this.duracion_viaje_valor(responseItinerario['listaVueltaDisponibles'][ab]['horaEmbarque'], responseItinerario['listaVueltaDisponibles'][ab]['horaDesembarque']);
                }

                this.listaVueltaDisponibles = responseItinerario['listaVueltaDisponibles'];
                cont_bien = 1;
              }else if(this.ida_vuelta == 2 && responseItinerario['listaVueltaDisponibles'] == null){
                this.mostrar_modal("modal_not_tickets_vuelta");
                cont_bien = 0;
              }
  
              if(cont_bien == 1){  
                if(this.listaIdaDisponibles.length != 0){
                  var datosItinerario = {
                    "nombre_ciudad_origen": this.nombre_ciudad_origen,
                    "nombre_ciudad_destino": this.nombre_ciudad_destino,
                    "codLocalidadIda": this.codLocalidadIda,
                    "codLocalidadDestino": this.codLocalidadDestino,
                    "nombre_fecha_ida": this.convert_format_fecha_guion(this.nombre_fecha_ida),
                    "nombre_fecha_vuelta": this.convert_format_fecha_guion(this.nombre_fecha_vuelta),
                    "listaIdaDisponibles": this.listaIdaDisponibles,
                    "listaVueltaDisponibles": this.listaVueltaDisponibles,
                    "ida_vuelta": this.ida_vuelta
                  }
              
                  localStorage.setItem("StorageDatosItinerario", JSON.stringify(datosItinerario));
              
                  if(this.nombre_fecha_vuelta == ""){this.nombre_fecha_vuelta="";};
              
                  this.mostrar_modal("modal_mensajeContinuar");

                  //this.ir_itinerario();
                }else{
                  this.mostrar_modal("modal_not_tickets_ida");
  
                  if(this.nombre_fecha_vuelta == ""){this.nombre_fecha_vuelta="";};
                }
              }
            }else{
              this.mostrar_modal("modal_not_tickets_ida");
            }
  
            $(".loader").fadeOut("slow");
          }, error =>{
            // ERROR
          },() =>{
            $(".loader").fadeOut("slow");
          });
        }*/
        
        
      }else{
        this.mostrar_modal("modal_not_continuar");
      }
    }else{
      //MENSAJE DE ALERTA DE LIQUIDACION
      this.notificacion_mensajes_alerta("Error", "Debe tener una liquidación abierta.");
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

  duracion_viaje_valor(horaEmbarque: string, horaDesembarque: string){
    var hora1: any = (horaDesembarque).split(":");
    var hora2: any = (horaEmbarque).split(":");
    var t1 = new Date();
    var t2 = new Date();
 
    t1.setHours(hora1[0], hora1[1]);
    t2.setHours(hora2[0], hora2[1]);
    
    //Aquí hago la resta
    t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes());
        
    return Number(t1.getHours() + "." + t1.getMinutes());
  }

  notificacion_mensajes_alerta(titulo: string, mensaje: string){
    this.tituloMensajeAlerta = titulo;
    this.textoMensajeAlerta = mensaje;

    this.mostrar_modal("modal_mensajealerta");
  }

  continuar_ir_itinerario(){
    this.ocultar_modal('modal_mensajeContinuar');

    this.ir_itinerario();
  }

  ir_itinerario(){
    this.router.navigate(['itinerario']);
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

  quitar_classes(){
    $("#nombre_ciudad_origen").removeClass("input_seleccionado");
    $("#nombre_ciudad_destino").removeClass("input_seleccionado");
    $("#nombre_fecha_ida").removeClass("input_seleccionado");
    $("#nombre_fecha_vuelta").removeClass("input_seleccionado");
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
