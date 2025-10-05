import { Component, OnInit, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { TaskService } from '../services/task.service';
import { SharedService } from '../shared.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

declare var $:any;

@Component({
  selector: 'app-pantalla-error',
  templateUrl: './pantalla-error.component.html',
  styleUrls: ['./pantalla-error.component.css']
})
export class PantallaErrorComponent implements OnInit {

  sub_titulo: string = "ERROR DE COMPRA";

  datosStorageErrorPos: any = "Error pantalla";

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    localStorage.setItem("StorageDatosPasajeros", JSON.stringify({}));
    localStorage.setItem("StorageResumenCompra", JSON.stringify({}));
    localStorage.setItem("StoragePDFImprimir", JSON.stringify({}));

    this.datosStorageErrorPos = localStorage.getItem('StorageErrorPos');
  }

  regresar_home(){
    this.router.navigate(['']);
  }

}