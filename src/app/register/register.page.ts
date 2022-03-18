import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { UserService } from '../services/user.service'; 
import { environment } from 'src/environments/environment';
import { cfaSignIn, cfaSignInPhone, cfaSignInPhoneOnCodeReceived, cfaSignInPhoneOnCodeSent } from 'capacitor-firebase-auth';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import * as firebase from 'firebase';
import { Media } from '../models/Media';
import { MediaService } from '../services/media.service';

import { CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
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
  Password = 'password';
  showPassword = false;
  //recaptchaVerifier:firebase.auth.RecaptchaVerifier;

  media : Media =  {
    serverId : 0, 
    code : "", 
    link : "",
    name : "",
    path : "",
    creationDate : null ,
    modificationDate : null,
    type : "" // MediaType Type
  }; 
  
  imgUrl ="";
  slectFile : any;
  uploading : boolean ;
  uploaded : boolean ;
  
  constructor(
    private userService : UserService,
    private router: Router, 
    private alertCtrl: AlertController,
    private mediaService : MediaService,
    public actionSheetController: ActionSheetController 
    ){ 
      this.uploading = false;
      this.uploaded = false;

      cfaSignInPhoneOnCodeSent().subscribe(
        verificationId => 
        {
          this.userService.verificationCode = verificationId;
          //console.log("Yesssssssssssssssssssssssssssssssssssssssssssssss");
          this.router.navigate(['/confirm/']);
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

    async selectImage() {
      const actionSheet = await this.actionSheetController.create({
        header: 'selectImageSource',
        buttons: [{
          text: 'loadFromDevice',
          handler: () => {
            this.mediaService.getImageFromLibrary(0);
          }
        },
        {
          text: 'useCamera',
          handler: () => {
            this.mediaService.getImageUsingCamera();
          }
        },
        {
          text: 'cancel',
          role: 'cancel'
        }
        ]
      });
      await actionSheet.present();
    }
  
    async addImageToFirebase(ident){
      await this.mediaService.uploadIUmage(this.mediaService.captureDataUrl, "Ayni", "avatars", ident).then(mediaData => {
        console.log("url :", this.mediaService.captureDataUrl);
      });
    }

  onChange($event){
    console.log("Ent =========== ", $event);
    
    this.slectFile = $event.target.files;
    console.log("Get File : ", this.slectFile);
    
  }
  async uploadImage(file) { 
    console.log("Name file ", file[0].name);
    console.log(" file ", file[0]);
    let ext = file[0].name.split('.').pop();
    console.log("Name file Extention ", ext);
    let id = new Date().toString(); 
    const task = await firebase.storage().ref('Profils').child(id).put(file[0]); 
    return task.ref.getDownloadURL();
  }
  typeFile(file){ 
    let exten = file[0].name.split('.').pop();
    const listImages = ["PNG", "png", "jpg","JPG"];
    const listPdfs = ["pdf", "PDF"];
    const listDocuments = ["txt", "TXT", "docx", "doc"];

    if(listImages.includes(exten)){
      return "Image";
    }
    else if(listPdfs.includes(exten)){
      return "PDF";
    }
    else if(listDocuments.includes(exten)){
      return "Documents";
    }
    else{
      return "Videos";
    }
  }
  async addMedia(idnt : string){ 
    this.uploading = true;
    await this.uploadImage(this.slectFile).then(
      data => {
        console.log("Type File : ", this.typeFile(this.slectFile));
        console.log("Url data : ", data);
        this.imgUrl = data.toString();
        this.media.name = this.slectFile[0].name.toString();
        this.media.link = data.toString();
        this.media.type = this.typeFile(this.slectFile);
        console.log("Link ", this.media.link);
        
        //this.media.path = data;
        var result = this.mediaService.AddMediaByIdUser(this.media, idnt)
        if(result != null){
          console.log("this.mediaService.AddMedia(this.media) " , result);
          this.uploaded = true;
          this.uploading = false;
        }
        this.uploaded = true;
      },
      err =>{
        this.uploading = false;
        this.uploaded = false;
      }
    );
    console.log("Url Img : ", this.imgUrl);
    this.uploading = false;
    
    //console.log(this.myForm.get('firstName')); 
  }
  returnMedia(){ 
    let media : Media;
    this.uploadImage(this.slectFile).then(
      data => {
        console.log("Type File : ", this.typeFile(this.slectFile));
        console.log("Url data : ", data);
        this.imgUrl = data.toString();
        this.media.name = this.slectFile[0].name.toString();
        this.media.link = data.toString();
        this.media.type = this.typeFile(this.slectFile);
        console.log("Link ", this.media.link);
        media = this.media;
      },
      err =>{
        media = null;
      }
    );
    return  this.media;
  }
  // show or hidde password
  toggleShow() {
    this.showPassword = !this.showPassword;
    //this.input.type = this.showPassword ? 'text' : 'password';
    this.Password = this.showPassword ? 'text' : 'password';
  }

  ngOnInit() {
    console.log("code id : ", this.userService.verificationCode);
    
    //this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  }

  async addNewMedia(){ 
    this.uploading = true;
    await this.addImageToFirebase('').then(
      data => {
        console.log("Type File : ", this.typeFile(this.slectFile));
        console.log("Url data : ", data); 
        this.media.name = this.mediaService.nameFile;
        this.media.link = this.mediaService.pictureLink;
        //this.media.type = this.typeFile(this.slectFile);
        console.log("Link ", this.media.link);
        
        /**
         * //this.media.path = data;
        this.mediaService.AddMediaByIdUser(this.media, idnt).then(
          reslt => {
            console.log("this.mediaService.AddMedia(this.media) " , reslt);
            this.uploaded = true;
            this.uploading = false;
          },
          err =>{
            this.uploading = false;
            this.uploaded = false;
          }
        );
         */
         
      },
      err =>{
        this.uploading = false;
        this.uploaded = false;
      }
    );
  }
 async login(form){
    //await this.addNewMedia();
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
      //media : this.mediaService.media,
      mediaServerId : null,
      type: 0,
      userLoginType: 1
    }
    console.log("Form ", this.form);
    await this.userService.getUserByIdent(form.value['phone']).subscribe(
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
              this.mediaService.uploadIUmage(this.mediaService.captureDataUrl, "Ayni", "pickters", form.value['identifiant']).then(mediaData => {
                console.log("url :", this.mediaService.captureDataUrl);
               // this.addNewMedia(form.value['identifiant']);
               //this.mediaService.updateMedia('rrr')
              });
              
              //this.addMedia(this.userService.identification);
              console.log(result);
              this.form = form.value;
              console.log("Form ", this.form);
             this.phoneAuth(form.value['phone']);
             //this.router.navigate(['/confirm/']); 
              //form.reset();
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
