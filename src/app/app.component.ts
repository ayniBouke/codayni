import { Component } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular'; 
import * as firebase from 'firebase'; 
 
import { environment } from 'src/environments/environment';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
//import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Location } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar, 
    private location: Location,
    public alertCtrl: AlertController
    ) { 

    firebase.initializeApp(environment.firebaseConfig);     
    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Handler was called!');
    });

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(true);
      //this.statusBar.styleDefault();
      //this.splashScreen.hide();
      // timer(1000).subscribe(() => this.showSplash = false) // <-- hide animation after 3s
    }); 

    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      if (this.location.isCurrentPathEqualTo('/details') || this.location.isCurrentPathEqualTo('/login')) {
        this.confirmExitApp();
        processNextHandler();
      } else {
        this.location.back();
      }
    });

  }


  async confirmExitApp() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmation Exit',
      message: 'Are you sure you want to exit ?',
      backdropDismiss: false,
      cssClass: 'confirm-exit-alert',
      buttons: [{
        text: 'Stay',
        role: 'cancel',
        handler: () => {
          console.log('Application exit  handler');
        }
      }, {
        text: 'Exit apps',
        handler: () => {
          navigator['app'].exitApp();
        }
      }]
    });

    await alert.present();
  }

}
