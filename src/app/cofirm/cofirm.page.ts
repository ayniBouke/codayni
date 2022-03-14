import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cfaSignIn, cfaSignInPhoneOnCodeSent } from 'capacitor-firebase-auth';
import * as firebase from 'firebase';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-cofirm',
  templateUrl: './cofirm.page.html',
  styleUrls: ['./cofirm.page.scss'],
})
export class CofirmPage implements OnInit {

  loading : boolean = false;
  code : string = '';
  constructor(private userService:UserService,private router: Router) { }

  ngOnInit() {
  }

  chechCode(){
    console.log("confirm++++++++++++++++++ ", this.code); 
    this.code = '';
  }


  confirm(){
    
    const credential = firebase.auth.PhoneAuthProvider.credential(this.userService.verificationCode, this.code);
    if(!credential){
      console.log("credential");
      
    }else{
      console.log("No credential");
    }
    firebase.auth().signInWithCredential(credential).then(data => {
      console.log('data', data);
      this.userService.activateUser(this.userService.identification);
      // this.authService.enableAccountWithPhone(this.signUpService.createUserPhone).then(data => {
      // // this.loadingControllerService.dismissLoadControl();
      // this.authService.logout = true;
      // this.toastService.presentToast(this.languageService.labelLocalization[this.labelManagementClass.YourAccountHasBeenActivated]);
      // this.loginAfterCreateAcccount();
      this.router.navigate(['/login/']);
      }, (err) => {
      //this.loadingControllerService.dismissLoadControl();
      this.code = ''
      }).catch( er => {
        this.code = '';
        console.log('erreur code ');
        
      });
      // }, (err) => {
      // this.codeIncorrect = false;
      // console.log(err);
      // let error = err;
      // if (error.includes('The sms verification code used to create the phone auth credential is invalid')) {
      // this.loadingControllerService.dismissLoadControl();
      // "Code Incorrect"
      // }
      // else 
      // { this.loadingControllerService.dismissLoadControl(); "err derver" } });
  }
}
