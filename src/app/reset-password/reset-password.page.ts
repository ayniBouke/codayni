import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { cfaSignIn, cfaSignInPhoneOnCodeReceived, cfaSignInPhoneOnCodeSent } from 'capacitor-firebase-auth';
 
import * as firebase from 'firebase';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  phone ;
  code ;
  isConf : boolean = false;

  constructor(private userService : UserService,
    private router: Router, 
    private alertCtrl: AlertController) {
    cfaSignInPhoneOnCodeSent().subscribe(
      verificationId => 
      {
        this.userService.verificationCode = verificationId;
        //console.log("Yesssssssssssssssssssssssssssssssssssssssssssssss");
      },
      //err => console.log("Nooooooooooooooooooooooooooooooooooooooooooooooo")
      
    )
    cfaSignInPhoneOnCodeReceived().subscribe(
      (event: { verificationId: string, verificationCode: string }) => {
        console.log(`${event.verificationId}:${event.verificationCode}`);
      this.router.navigate(['/reset-password/']);
  
      });
   }

  ngOnInit() {
  }

  async envoyer(){
    this.isConf = true;
    this.userService.phoneNum = this.phone;
    console.log("Envoyer ", this.phone);
    await this.phoneAuth(this.phone); 
    // this.router.navigate(['/confirm/']);
  }

  phoneAuth(number: string) {
    var phone=`+222${number}`;
    cfaSignIn('phone', { phone: phone }).subscribe(data => {
      console.log(data);
     
    });
  }
  sendPhone(nbr) {
      
    nbr =`+222${nbr}`;
    cfaSignInPhoneOnCodeSent().subscribe(
      verificationId => console.log('Verification code received: ' + verificationId)
  );
    console.log('Attempting to send phone number: ' + nbr);
    cfaSignIn('phone', { phone : nbr }).subscribe(
        user => {
          
            console.log(user.phoneNumber)
            console.log('Number: ' + nbr + ' sent successfully'),
                cfaSignInPhoneOnCodeSent().subscribe(
                    verificationId => console.log('Verification code received: ' + verificationId)
                );
        }
    );
  }
  
  confirm(){
    const credential = firebase.auth.PhoneAuthProvider.credential(this.userService.verificationCode, this.code);
    if(!credential){
      console.log("credential");
      
    }else{
      console.log("No credential");
    }
    this.router.navigate(['/new-password/']);
     
  }
}
