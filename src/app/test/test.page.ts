import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormControlName } from '@angular/forms'; 
import { ActionSheetController, AlertController, Platform } from '@ionic/angular'; 
import { cfaSignIn, cfaSignInPhone, cfaSignInPhoneOnCodeReceived, cfaSignInPhoneOnCodeSent } from 'capacitor-firebase-auth';
 
//import { Geolocation } from '@ionic-native/geolocation';
import { Globalization } from '@awesome-cordova-plugins/globalization/';

import { CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';

//import { FirebaseStorage } from 'angularfire2';
import * as firebase from 'firebase';
import { Media } from '../models/Media';
import { MediaService } from '../services/media.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {
   options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }
  myForm : FormGroup ;
  slectFile : any;
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
  filesCollection: any ;
  
  imgUrl = "https://firebasestorage.googleapis.com/v0/b/smpnt-projects.appspot.com/o/Profils%2FFri%20Mar%2011%202022%2010%3A07%3A25%20GMT%2B0100%20(Central%20European%20Standard%20Time)?alt=media&token=787d5dea-405f-400d-b636-6561d6dac11c";
  
  uploading : boolean ;
  uploaded : boolean ;

  myPhoto ;
  constructor( 
    public camera: Camera,
    private platform : Platform, 
    private userService : UserService,
    private router: Router, 
    private alertCtrl: AlertController,
    private mediaService : MediaService,
    public actionSheetController: ActionSheetController, 
    private geolocation: Geolocation
    ) { 
      this.geolocation.getCurrentPosition().then((resp) => {
        // resp.coords.latitude
        // resp.coords.longitude
        console.log('getting location ', resp);
        console.log('getting location latitude ', resp.coords.latitude);
        console.log('getting location longitude ', resp.coords.longitude);
       }).catch((error) => {
         console.log('Error getting location', error);
       });
       
       let watch = this.geolocation.watchPosition();
       watch.subscribe((data) => {
        console.log('getting location Data', data);
        // data can be a set of coordinates, or an error (if an error occurred).
        // data.coords.latitude
        // data.coords.longitude
       });
      //
      this.uploading = false;
      this.uploaded = false;
    }

  ngOnInit() {
    this.mediaService.getMedias().subscribe(
      data => console.log("Media ", data),
      err => console.log("err ", err)
    )
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
        role: 'cancel',
        
      }
      ]
    });
    await actionSheet.present();
  }

  async addImageToFirebase(){
    this.uploading = true;
    await this.mediaService.updateIUmage(this.mediaService.captureDataUrl, "Ayni", "pickters").then(
      mediaData => {
      console.log("url :", this.mediaService.captureDataUrl);
      this.uploading = false;
      this.uploaded = true;
    },
    err => {
      this.uploading = false 
    }
    );
  }














  async selectPhoto() {
    await this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      console.log(base64Image);
      this.imgUrl = base64Image;
      let id = new Date().toString();
      this.uploadIUmage(base64Image, 'NameImg').then(
        data => console.log("Access upload ", data),
        err => console.log("Err upload ", err)
      )
    });
  }
  uploadIUmage(captureDataUrl, name) {
    return new Promise((resolve, reject) => {
        var metadata = {
            contentType: 'image/jpeg',
        };
        let storageRef = firebase.storage().ref();
        console.log('start uploading image');
        // Create a timestamp as filename
        const filename = name + Math.floor(Date.now() / 1000);
        // Create a reference to 'images/todays-date.jpg'
        const imageRef = storageRef.child(`images/${filename}.jpg`);
        imageRef.putString(captureDataUrl, 'data_url', { contentType: 'image/jpg' }).then((snapshot) => { //, 'data_url', { contentType: 'image/jpg' }
          console.log('image uploaded');
          // Do something here when the data is succesfully uploaded!
          //this.fileName = snapshot.ref.name;
          snapshot.ref.getDownloadURL().then((downloadURL) => {
            resolve(downloadURL);
          });
        }, (err) => {
            console.log('error uploading image');
            console.log(err);

            reject(err);
        });
    });
}



  async uploadPhoto(photoName: string) {
    let id = new Date().toString();
    await firebase.storage().ref(`/Profils/${ id }/`).child(photoName)
      .putString(this.myPhoto, 'base64', { contentType: 'image/png' })
      .then((savedPicture) => {
        this.imgUrl = savedPicture.downloadURL;
        console.log("Get Url ", this.imgUrl);
        
      });
  }
  

  // async tstCamera(){ 
   
     
  //   console.log("Tst camera Img ", image);
  //   var imageUrl = await image.then(
  //     imgData =>{
  //       let img = imgData.base64String;
  //       let base64Image = 'data:image/jpeg;base64,' + imgData;
  //       //img = this.readAsBase64(imgData); //'data:image/jpeg;base64,'+imgData;
  //       this.imgUrl = imgData.webPath;
  //       console.log("Tst camera imageUrl ", imgData.webPath);
  //       //let url = this.uploadImage(im);
  //       //img = this.readAsBase64(imgData) // 'data:image/jpg;base64,' + imgData;
  //       //let urlBlob = this.b64toBlob(imgData.base64String); //'data:image/jpeg;base64,'+
      
  //       var metadata = {
  //         contentType: 'image/jpg'
  //       };

  //       let id = new Date().toString()+'.jepg' ;
  //       const task = firebase.storage().ref(id).putString(base64Image) ; //putString(imgData.webPath , 'data_url'); .putString(img)   
  //       let url = task.then(
  //         ref =>{
  //           console.log("ref from fire " , ref.ref.getDownloadURL())
  //         },
  //         err => console.log(err)
          
  //       )
  //       console.log("Url from upload ", url);
  //       // Can be set to the src of an image now
  //       //imageElement.src = imageUrl;
  //     } 
  //   );    
    
  // };
  b64toBlob(b64Data) {
    const byteCharacters = b64Data;
    const byteArrays = [];
    const sliceSize = 512;
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
 
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
 
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
 
    const blob = new Blob(byteArrays, { type: 'image/jpeg' });
    return blob;
  }

  base64ToImage(dataURI) {
    //atob(decodeURIComponent(dataURI));
    const fileDate = dataURI.split(',');
    // const mime = fileDate[0].match(/:(.*?);/)[1];
    const byteString = atob(fileDate[1]) //atob(fileDate[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: 'image/png' });
    return blob;
  }

  // private async readAsBase64(cameraPhoto: Photo) {
  //   // Fetch the photo, read as a blob, then convert to base64 format
  //   const response = await fetch(cameraPhoto.webPath!);
  //   const blob = await response.blob();
  
  //   return await this.convertBlobToBase64(blob) as string;  
  // }
  
  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  UrltoBlob(dataUrl){
    let binary = dataUrl //atob(dataUrl.split(',')[1]);
    let array = [];
    console.log(" binary.length ",  binary.length);
    
    for(let i = 0; i < binary.length; i++){
      array.push(binary.charAt(i));
    }
    return new Blob([new Uint8Array(array)], {type:'image/jpeg'});
  } 

  onChange($event){
    this.slectFile = $event.target.files;
    console.log("Get File : ", this.slectFile  ); 
  }
  async uploadImage(file) : Promise<any> { 
    //console.log("Name file ", file[0].name);
    //console.log(" file ", file[0]);
    let ext = file.format ; // file[0].name.split('.').pop();
    //console.log("Name file Extention ", ext);
    let id = new Date().toString(); 
    const task = await firebase.storage().ref('Profils').child(id).put(file);
    
    //firebase.firestore.Firestore.arguments.ref('Profils').child(id).put(file[0])
    //firebase.storage.apply( `Profils/${id}`).getDownloadUrl().toPromise();
    //return firebase.storage().ref('Profils').child(id).getDownloadUrl() //.toPromise();
    return task.ref.getDownloadURL();
  }
  form(){
    this.myForm = new FormGroup({
      firstName : new FormControl('', Validators.required),
      lastName : new FormControl('', Validators.required)
    })
  }
  async upload(){ 
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
        var result = this.mediaService.AddMedia(this.media)
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
}
