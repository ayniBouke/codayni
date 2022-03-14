import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import * as firebase from 'firebase'; 
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private platform: Platform) {

    firebase.initializeApp(environment.firebaseConfig);     
    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Handler was called!');
    });
  }
}
