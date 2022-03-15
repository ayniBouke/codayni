import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { UserService } from '../services/user.service';

import { environment } from 'src/environments/environment';
import { cfaSignIn, cfaSignInPhone, cfaSignInPhoneOnCodeReceived, cfaSignInPhoneOnCodeSent } from 'capacitor-firebase-auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  message : string = "";
  loading : boolean = false;
  form : User;

  phoneRepeat : boolean = false;
  //recaptchaVerifier:firebase.auth.RecaptchaVerifier;

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
          // this.authService.enableAccountWithPhone(this.signUpService.createUserPhone).then((data => {
          //   this.loadingControllerService.dismissLoadControl();
          //   this.authService.logout = true;
          //   this.toastService.presentToast(this.languageService.labelLocalization[this.labelManagementClass.YourAccountHasBeenActivated]);
          //   this.loginAfterCreateAcccount();
            //  this.loginbtn();
        // }));
        this.router.navigate(['/confirm/']);
    
        });
  }


  


  ngOnInit() {
    console.log("code id : ", this.userService.verificationCode);
    
    //this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  }

 async login(form){
    this.form = {
      serverId : 1000,
      firstName : form.value['firstName'],
      lastName : form.value['lastName'],
      identifiant : form.value['identifiant'],
      phone : form.value['phone'],
      email : form.value['email'],
      password : form.value['password'],
      creationDate : null ,
      modificationDate : null ,
      isActivated : false ,
      settingServerId : 5,
      mediaServerId : 0,
      type: 0,
      userLoginType: 1
    }
    console.log("Form ", this.form);
    this.userService.getUserByIdent(form.value['phone']).subscribe(
      (user : User) =>{
        if(user && user.phone){
          this.phoneRepeat = true;
          console.log("Have acompt ");
          //form.reset();
        }
        else{
          this.phoneRepeat = false;
          this.userService.register(this.form).subscribe(
            result => {
              this.userService.identification = form.value['identifiant'];
              form.reset();
              console.log(result);
              this.form = form.value;
              console.log("Form ", this.form);
             this.phoneAuth(form.value['phone']);
             this.router.navigate(['/confirm/']); 
            },
            err => console.log(err)
          );
        }
      }
    );
   
   
  }


  phoneAuth(number: string) {
      var phone=`+222${number}`;
      cfaSignIn('phone', { phone: phone }).subscribe(data => {
        console.log(data);
        
      });
  }

  



  sendPhone(nbr) {
    nbr =`+222${nbr}`;
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
  
}
