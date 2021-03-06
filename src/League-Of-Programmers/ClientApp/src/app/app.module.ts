import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
//  import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RoutesModule } from './routers.module';

import { HTTP_INTERCEPTOR_PROVIDERS } from './interceptors/barrel';

import { MaterialModule } from './shared/material.module';
import { SharedModule } from './shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './routers/nav-menu/nav-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    HttpClientModule,
    //  FormsModule,
    RoutesModule,
    MaterialModule,
    MarkdownModule.forRoot(),
    SharedModule
  ],
  providers: [HTTP_INTERCEPTOR_PROVIDERS],
  bootstrap: [AppComponent]
})
export class AppModule { }
