import { Component, OnInit, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { SharedService } from '../shared.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Observable, Subscription } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

declare var $:any;

@Component({
  selector: 'app-politica-privacidad',
  templateUrl: './politica-privacidad.component.html',
  styleUrls: ['./politica-privacidad.component.css']
})
export class PoliticaPrivacidadComponent implements OnInit {

  public innerWidth: any;

  constructor(private route: ActivatedRoute, private router:Router, @Inject(PLATFORM_ID) private platformId: Object, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId)){
      this.innerWidth = window.innerWidth;
      
      $('#cabecera1').css('display', 'none');
      $('#cabecera3').css('display', 'none');
      $('#cabecera12').css('display', 'none');

      $('#icon_menu_sidebar').css('display', 'none');
      $('#icon_back_page').css('display', 'none');
      $('#icon_home_page').css('display', 'inline');

      if(this.innerWidth<767){
        $('#cabecera2').css('display', 'none');
        $('#cabecera22').css('display', 'block');
      }else{
        $('#cabecera2').css('display', 'block');
        $('#cabecera22').css('display', 'none'); 
      }

      $(".loader").fadeOut("slow");
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if(isPlatformBrowser(this.platformId)){
      this.innerWidth = window.innerWidth;
    }

    if(this.innerWidth<767){
      $('#cabecera1').css('display', 'none');
      $('#cabecera3').css('display', 'none');

      $('#cabecera2').css('display', 'none');
      $('#cabecera22').css('display', 'block');
    }else{
      $('#cabecera2').css('display', 'block');
      $('#cabecera22').css('display', 'none'); 
    }
  }

}
