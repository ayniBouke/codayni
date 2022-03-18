
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { File } from '@ionic-native/file/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { Media } from '../models/Media';
import { config } from '../app.module';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class MediaService {

  public captureDataUrl: any = '';
  public showIcon = true;
  nameFile = "";
  public pictureLink: any = '';
  public lisence: Media = new Media();
  public avatar: Media = new Media();

  constructor(
    public camera: Camera,
    public file: File,
    public ImagePicker: ImagePicker,
    private httpClient: HttpClient,
    public navController: NavController,
  ) {
    // firebase.initializeApp(firebaseConfig);
  }

  uploadIUmage(captureDataUrl, name, firebaseStorageFile) {


    return new Promise((resolve, reject) => {
      let storageRef = firebase.storage().ref();
      console.log('start uploading image');
      // Create a timestamp as filename
      const filename = name + Math.floor(Date.now());
      // Create a reference to 'images/todays-date.jpg'
      const imageRef = storageRef.child(`${firebaseStorageFile}/${filename}.jpg`);
      imageRef.putString(captureDataUrl, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
        console.log('Image has been uploaded successfully');
        console.log(snapshot);

        // Do something here when the data is succesfully uploaded!
        this.nameFile = snapshot.ref.name;
        this.avatar.name = snapshot.ref.name;
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('image url : ');

          this.avatar.link = downloadURL;
          console.log(downloadURL);
 
          resolve(downloadURL);

        });
      }, (err) => {
        console.log('error uploading image');
        reject(err);

      });
    });
  }

  getImageFromLibrary(sourceType) {


    const cameraOptions: CameraOptions = {
      quality: 100,
      targetHeight: 600,
      targetWidth: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType
    };
    this.camera.getPicture(cameraOptions)
      .then((captureDataUrl) => {
        this.captureDataUrl = 'data:image/jpeg;base64,' + captureDataUrl;
        this.showIcon = false;


      }, (err) => {
        //console.log(err);

      });
  }

  getImageUsingCamera() { 
    const cameraOptions: CameraOptions = {
      quality: 100,
      targetHeight: 600,
      targetWidth: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };
    this.camera.getPicture(cameraOptions)
      .then((captureDataUrl) => {
        this.captureDataUrl = 'data:image/jpeg;base64,' + captureDataUrl;
        this.showIcon = false;


      }, (err) => {
        //console.log(err);

      });
  }


  createMediaObject(media: Media) {


    console.log(media);
    return new Promise((resolve, reject) => {
      console.log('start creating media object...');
      this.httpClient.post(config.serviceBase + "api/medias/register", media).subscribe((response) => {
        console.log('response = ');
        this.lisence = response as Media;

        resolve(response);

      }, (err) => {
        console.log('error : ');
        console.log(err);

        reject(err);
        console.log(err);

      });
    });
  }


  updateMedia(media: Media) {


    console.log(media);
    return new Promise((resolve, reject) => {
      this.httpClient.post(config.serviceBase + "api/medias/updateMedia", media).subscribe((response) => {
        resolve(response);
        this.avatar = response as Media;
      }, (err) => {
        reject(err);

      });
    });
  }

  getPicture(link: any) {
    this.pictureLink = link;
    console.log("Picture Link : ",link);
    this.navController.navigateRoot(['profile-picture']);
  }

}