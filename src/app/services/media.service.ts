import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'; 
import { File } from '@ionic-native/file/ngx'; 
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { NavController } from '@ionic/angular';
import * as firebase from 'firebase';
import { config } from '../app.module';
import { Media } from '../models/Media';
import { User } from '../models/User';
import { UserService } from './user.service';

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
  public media: Media = new Media();

  constructor(private http : HttpClient, 
    private userService : UserService,
    private camera: Camera,
    private file: File,
    private ImagePicker: ImagePicker,
    private httpClient: HttpClient,
    private navController: NavController 
    ) { }

  getMedias() {
    //this.allData = this.http.get<any[]>(this.getApiUrl);
    return this.http.get(config.serviceBase + 'api/medias/');
  }
  
  getMedia(id : number) {
    return this.http.get<Media>(config.serviceBase +'api/medias/' + id );
  }
  //api/medias/add
  async AddMedia(data : Media){ 
    console.log("AddData");
    
    await this.http.post(config.serviceBase + 'api/medias/add', data  ).subscribe(
      (media : Media) =>{
        console.log("Get media ", media) 
        this.userService.getUserByIdent(this.userService.identification).subscribe(
          (user : User) => {
            console.log("Get user  ", user) 
            //user.lastName = user.lastName + " updated";
            user.media = media;
            user.mediaServerId = media.serverId;
            //user.mediaServerId = 18;
            this.userService.update(user).subscribe(
              upUser => console.log("User updated ", upUser)  ,
              err => console.log("User not update err ", err) 
            );
          },
          err => {
            console.log("Get user err ", err)  
          }
        )
      }
    );
  }
  
  async AddMediaByIdUser(data : Media, identifiant : string){ 
    console.log("AddData");
    
    await this.http.post(config.serviceBase + 'api/medias/add', data  ).subscribe(
      (media : Media) =>{
        console.log("Get media ", media) 
        this.userService.getUserByIdent(identifiant).subscribe(
          (user : User) => {
            console.log("Get user  ", user) 
            //user.lastName = user.lastName + " updated";
            user.media = media;
            user.mediaServerId = media.serverId;
            //user.mediaServerId = 18;
            this.userService.update(user).subscribe(
              upUser => console.log("User updated ", upUser)  ,
              err => console.log("User not update err ", err) 
            );
          },
          err => {
            console.log("Get user err ", err)  
          }
        )
      }
    );
  }

  deleteMedia(id : number) {
    return this.http.delete<Media>(config.serviceBase + 'api/medias/' + id );
  }


  //Media
  
  uploadIUmage(captureDataUrl, name, firebaseStorageFile, ident) { 

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
        //this.nameFile = snapshot.ref.name;
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('image url : ');

          console.log(downloadURL);
          this.pictureLink = downloadURL;
          this.media.name = snapshot.ref.name;
          this.media.link = downloadURL.toString();
          this.createMediaObject(this.media, ident);
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
      sourceType:sourceType
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

  createMediaObject(media: Media, identifiant:string) { 
    console.log(media);
    return new Promise((resolve, reject) => {
      console.log('start creating media object...');
      this.httpClient.post(config.serviceBase + "api/medias/add", media).subscribe((response : Media) => {
        console.log('response = ');
        this.lisence = response as Media;
        this.userService.getUserByIdent(identifiant).subscribe(
          (user : User) => {
            console.log("Get user  ", user) 
            console.log("Media   ", response) 
            //user.lastName = user.lastName + " updated";
            //user.media = media;
            user.mediaServerId = this.lisence.serverId;  //2047 // response.serverId;
            //user.mediaServerId = 18;
            this.userService.update(user).subscribe(
              upUser => console.log("User updated ", upUser)  ,
              err => console.log("User not update err ", err) 
            );
          },
          err => {
            console.log("Get user err ", err)  
          }
        )
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
