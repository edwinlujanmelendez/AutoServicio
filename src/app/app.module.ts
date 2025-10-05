import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ItinerarioComponent } from './itinerario/itinerario.component';
/*import { AsientosComponent } from './asientos/asientos.component';
import { DatosPasajerosComponent } from './datos-pasajeros/datos-pasajeros.component';
import { ItinerarioRetornoComponent } from './itinerario-retorno/itinerario-retorno.component';
import { AsientosRetornoComponent } from './asientos-retorno/asientos-retorno.component';
import { ConfirmacionPagoComponent } from './confirmacion-pago/confirmacion-pago.component';*/
import { Ng2TelInputModule } from 'ng2-tel-input';
import { GoogleTagManagerModule, GoogleTagManagerService } from 'angular-google-tag-manager';
import { Routes, RouterModule } from '@angular/router';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import {APP_BASE_HREF} from '@angular/common';
import { PoliticaPrivacidadComponent } from './politica-privacidad/politica-privacidad.component';
import { MantenimientoComponent } from './mantenimiento/mantenimiento.component';
import { InicioComponent } from './inicio/inicio.component';
import { SeleccionComponent } from './seleccion/seleccion.component';
import { AsientosComponent } from './asientos/asientos.component';
import { DatosPasajerosComponent } from './datos-pasajeros/datos-pasajeros.component';
import { ItinerarioRetornoComponent } from './itinerario-retorno/itinerario-retorno.component';
import { AsientosRetornoComponent } from './asientos-retorno/asientos-retorno.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { PantallaErrorComponent } from './pantalla-error/pantalla-error.component';
import { ResumenCompraComponent } from './resumen-compra/resumen-compra.component';
import { CajaComponent } from './caja/caja.component';
import { ReimprimirBoletosComponent } from './reimprimir-boletos/reimprimir-boletos.component';
import { EnviarPdfCorreoComponent } from './enviar-pdf-correo/enviar-pdf-correo.component';

const routes: Routes = [
  {path: '', component: InicioComponent, pathMatch: 'full'},
  //{path: '', component: MantenimientoComponent, pathMatch: 'full'},
  //{path: '404', component: MantenimientoComponent, pathMatch: 'full'},
  //{path: '**', component: MantenimientoComponent, pathMatch: 'full'},
  {path: 'seleccion', component: SeleccionComponent},
  {path: ':salida/:llegada', component: ItinerarioComponent},
  {path: 'itinerario', component: ItinerarioComponent},
  {path: 'asientos', component: AsientosComponent},
  {path: 'itinerario-retorno', component: ItinerarioRetornoComponent},
  {path: 'asientos-retorno', component: AsientosRetornoComponent},
  {path: 'datos-pasajeros', component: DatosPasajerosComponent},
  {path: 'forma-pago', component: DatosPasajerosComponent},
  {path: 'configuracion', component: ConfiguracionComponent},
  {path: 'pantalla-error', component: PantallaErrorComponent},
  {path: 'resumen-compra', component: ResumenCompraComponent},
  {path: 'reimprimir-boletos', component: ReimprimirBoletosComponent},
  {path: 'enviar-pdf-correo', component: EnviarPdfCorreoComponent},
  //{path: 'caja', component: CajaComponent},
  //{path: 'confirmacion-pago', component: ConfirmacionPagoComponent},
  {path: 'politica-privacidad', component: PoliticaPrivacidadComponent},
];

/*const routes: Routes = [
  {path: '', component: ItinerarioComponent, pathMatch: 'full'},
  {path: 'Ecommerce', component: ItinerarioComponent},
  {path: 'Ecommerce/itinerario', component: ItinerarioComponent},
  {path: 'itinerario', component: ItinerarioComponent},
  {path: 'Ecommerce/asientos', component: AsientosComponent},
  {path: 'asientos', component: AsientosComponent},
  {path: 'Ecommerce/itinerario-retorno', component: ItinerarioRetornoComponent},
  {path: 'itinerario-retorno', component: ItinerarioRetornoComponent},
  {path: 'Ecommerce/asientos-retorno', component: AsientosRetornoComponent},
  {path: 'asientos-retorno', component: AsientosRetornoComponent},
  {path: 'Ecommerce/datos-pasajeros', component: DatosPasajerosComponent},
  {path: 'datos-pasajeros', component: DatosPasajerosComponent},
  {path: 'Ecommerce/confirmacion-pago', component: ConfirmacionPagoComponent},
  {path: 'confirmacion-pago', component: ConfirmacionPagoComponent},
];*/

@NgModule({
  declarations: [
    AppComponent,
    ItinerarioComponent,
    //AsientosComponent,
    //DatosPasajerosComponent,
    //ItinerarioRetornoComponent,
    //AsientosRetornoComponent,
    //ConfirmacionPagoComponent,
    PoliticaPrivacidadComponent,
    MantenimientoComponent,
    InicioComponent,
    SeleccionComponent,
    AsientosComponent,
    DatosPasajerosComponent,
    ItinerarioRetornoComponent,
    AsientosRetornoComponent,
    ConfiguracionComponent,
    PantallaErrorComponent,
    ResumenCompraComponent,
    CajaComponent,
    ReimprimirBoletosComponent,
    EnviarPdfCorreoComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    //AppRoutingModule,
    FormsModule,
    HttpClientModule,
    Ng2TelInputModule,
    //RouterModule.forRoot(routes, {useHash: true}),
    //RouterModule.forRoot(routes, {useHash: true}),
    RouterModule.forRoot(routes, {
        initialNavigation: 'enabled'
    })
  ],
  providers: [
    //{provide: LocationStrategy, useClass: PathLocationStrategy}
    //{provide: APP_BASE_HREF, useValue: '/Ecommerce/'}
  ],
  exports: [RouterModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
