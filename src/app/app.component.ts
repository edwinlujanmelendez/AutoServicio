import { Component, Output, Input, HostListener, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { SharedService } from './shared.service';
import { Subscription } from 'rxjs';
import { ItinerarioComponent } from './itinerario/itinerario.component';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { TaskService } from './services/task.service';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  texto_procesando: string = "";
  contador: number = 0;

  intervalo_tiempo: any;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private titleService: Title, private meta: Meta, private router:Router) {
    if(isPlatformBrowser(this.platformId)){
      this.titleService.setTitle('AutoServicio - Viaja seguro, viaja en bus con Movil Bus');
      this.meta.addTag({ name: 'description', content: 'Transformamos tus viajes en experiencias inolvidables. Conoce más de Movil Bus, líder en transporte en bus en Perú. ¡Aprovecha los increíbles precios y reserva tu próximo viaje con bus con Movil Bus! Más de 50 destinos para descubrir de la manera más cómoda y segura. ¿Cuál es la mejor agencia de viajes del Perú?' });
      this.meta.addTag({ name: 'keywords', content: 'Movil Bus, Pasajes, Viajes, Bus, Transporte, Experiencias, Perú, Agencia, Lima, Arequipa, Trujillo, Barranca, Chiclayo, Chimbote, Ica, Tarapoto, Piura' });
      this.meta.addTag({ name: 'url', content: 'https://www.movilbus.pe/' });
      this.meta.addTag({ name: 'site_name', content: 'AutoServicio - Viaja seguro, viaja en bus con Movil Bus' });
    }
  }

  ngOnInit(): void {
    $(".loader").fadeOut("slow");
    $(".loader2").fadeOut("slow");
    $(".loader3").fadeOut("slow");

    let that = this;
    setInterval(function () {
      if(that.contador == 1){
        that.texto_procesando = "IMPRIMIENDO";
      }else if(that.contador == 2){
        that.texto_procesando = "IMPRIMIENDO.";
      }else if(that.contador == 3){
        that.texto_procesando = "IMPRIMIENDO..";
      }else if(that.contador == 4){
        that.texto_procesando = "IMPRIMIENDO...";
      }else{
        that.contador = 1;
      }
      
      that.contador++;
    }, 750);
  }

  ngAfterViewInit(){
    let getDatosConfiguracion = JSON.parse(localStorage.getItem('StorageDatosConfiguracion') || '{}');
    if(JSON.stringify(getDatosConfiguracion)=="{}"){
      this.router.navigate(['configuracion']);
    }else{
      if(getDatosConfiguracion['codAgenciaOrigen'] == 0 || getDatosConfiguracion['idUsuarioSispas'] == 0 || getDatosConfiguracion['cantidad_asientos_select'] == 0){
        this.router.navigate(['configuracion']);
      }
    }
  }

  /*clearInterval(){
    clearInterval(this.intervalo_tiempo);
  }*/

  /*temporizador(minutos: number, segundos: number){
    var val_interval = 1;
    this.intervalo_tiempo = setInterval(() => {
      if(val_interval == 1){
        segundos = segundos - 1;
        if(segundos == 0){
          if(minutos > 0){
            minutos = minutos - 1;
            segundos = 59;
          }
        }
        if(segundos > -1){
          var time = minutos+":"+segundos;
          console.log(time);
        }else{
          //console.log("SE ACABO EL TIEMPO");
          clearInterval(this.intervalo_tiempo);
          this.router.navigate(['']);
        }
      }
    }, 1000);
  }*/
  
}
