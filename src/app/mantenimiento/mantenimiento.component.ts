import { Component, OnInit, HostListener, PLATFORM_ID, Inject } from '@angular/core';

import { isPlatformBrowser, isPlatformServer } from '@angular/common';

declare var $:any;

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css']
})
export class MantenimientoComponent implements OnInit {

  public innerWidth: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId)){
      this.innerWidth = window.innerWidth;

      $('#cabecera1').css('display', 'none');
      $('#cabecera2').css('display', 'none');
      $('#cabecera3').css('display', 'none');

      if(this.innerWidth>766){
        $('#img_desktop').css('display', 'inline');
        $('#img_mobile').css('display', 'none');
      }else if(this.innerWidth<766){
        $('#img_desktop').css('display', 'none');
        $('#img_mobile').css('display', 'inline');
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if(isPlatformBrowser(this.platformId)){
      this.innerWidth = window.innerWidth;

      if(this.innerWidth>766){
        $('#img_desktop').css('display', 'inline');
        $('#img_mobile').css('display', 'none');
      }else if(this.innerWidth<766){
        $('#img_desktop').css('display', 'none');
        $('#img_mobile').css('display', 'inline');
      }
    }
  }
}