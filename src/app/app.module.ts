import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; 
//import { IonicStorageModule } from '@ionic/storage';

//import { AngularFireModule } from 'angularfire';
// 1. Import the libs you need
//import { AngularFireModule } from '@angular/fire';
//import { AngularFireModule } from 'angularfire2'; 
//import { AngularFireAuthModule } from 'angularfire2/auth'; 
//import { AngularFireStorageModule } from 'angularfire2/storage';  

//import { IonicModule, IonicRouteStrategy } from '@ionic/angular';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptorService } from './services/oauth-interceptor';
import { environment } from 'src/environments/environment';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
 

import { CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';

export const config = {
  serviceBase: "http://192.168.1.200:1007/",
  clientId: 'market-place',
  clientSecret: 'Hmd123'
}

@NgModule({
  
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, FormsModule, IonicModule.forRoot(),ReactiveFormsModule, AppRoutingModule, HttpClientModule
  ], 
  providers: [  
    Camera, File, ImagePicker, SplashScreen,StatusBar,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
