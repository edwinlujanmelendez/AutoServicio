import { Component, OnInit, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { TaskService } from '../services/task.service';
import { SharedService } from '../shared.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { saveAs } from 'file-saver';

declare var $:any;

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css']
})
export class CajaComponent implements OnInit {

  sub_titulo: string = "Caja";
  idUsuario: number = 0;
  idAgencia: number = 0;

  constructor(private taskService: TaskService, private router:Router, private sharedService:SharedService, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(){
    let getDatosConfiguracion = JSON.parse(localStorage.getItem('StorageDatosConfiguracion') || '{}');
    if(JSON.stringify(getDatosConfiguracion)=="{}"){
      this.router.navigate(['configuracion']);
    }else{
      if(getDatosConfiguracion['codAgenciaOrigen'] == 0 || getDatosConfiguracion['idUsuarioSispas'] == 0 || getDatosConfiguracion['cantidad_asientos_select'] == 0){
        this.router.navigate(['configuracion']);
      }else{
        //console.log(getDatosConfiguracion);
        this.idUsuario = getDatosConfiguracion['idUsuarioSispas'];
        this.idAgencia = getDatosConfiguracion['codAgenciaOrigen'];
      }
    }

    $("#div_pos_echo").css("display", "inline");
    $("#div_pos_cierre").css("display", "none");
  }

  btn_pos_echo(){
    $(".loader").fadeIn("slow");
    $("#div_pos_echo").css("display", "inline");
    $("#div_pos_cierre").css("display", "none");

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
    $("#div_pos_echo").css("display", "none");
    $("#div_pos_cierre").css("display", "inline");

    $('#txt_api_pos_cierre').val("http://localhost:8080/pcl/batch");

    this.taskService.getVerificarCajaAbierta(this.idUsuario, this.idAgencia).subscribe(responseVerificarCajaAbierta=> {
      // ? 0:Caja Cerrada - 1:Caja Abierta
      //console.log(responseVerificarCajaAbierta);
      if(responseVerificarCajaAbierta['result'] == false){
        this.taskService.getCierre().subscribe(responseCierre=> {
          $('#textarea_api_pos_cierre').val(JSON.stringify(responseCierre));
          
          var jsonArray = {
            voucherClient: responseCierre['report']
          }
          
          const blob = new Blob([JSON.stringify(jsonArray)], { type: 'application/octet-stream' });
          saveAs(blob, "4C608A6XX.json");

          $(".loader").fadeOut("slow");
        });
      }else{
        $(".loader").fadeOut("slow");
        this.mostrar_modal("modal_cajaAbierta");
      }
    });
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

}