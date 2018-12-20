import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

import { AgmCoreModule } from '@agm/core';
import { MapContentComponent } from './map-content/map-content.component';
import { PlazasService } from './plazas.service';
registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    MapContentComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAYw1rqa9mL1-__v8h2CVgsRJmpmP2mP1s' // AIzaSyAYw1rqa9mL1-__v8h2CVgsRJmpmP2mP1s
    }),
    HttpClientModule
  ],
  providers: [PlazasService,],
  bootstrap: [AppComponent]
})
export class AppModule { }
