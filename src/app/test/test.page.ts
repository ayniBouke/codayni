import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormControlName } from '@angular/forms';

import { cfaSignIn, cfaSignInPhone, cfaSignInPhoneOnCodeReceived, cfaSignInPhoneOnCodeSent } from 'capacitor-firebase-auth';
//import { FirebaseStorage } from 'angularfire2';
import * as firebase from 'firebase';
import { Media } from '../models/Media';
import { MediaService } from '../services/media.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

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

  constructor(
    private mediaService : MediaService
    //private afStorage: FirebaseStorage 
    ) { 
      this.uploading = false;
      this.uploaded = false;
    }

  ngOnInit() {
    this.mediaService.getMedias().subscribe(
      data => console.log("Media ", data),
      err => console.log("err ", err)
    )
  }
  onChange($event){
    this.slectFile = $event.target.files;
    console.log("Get File : ", this.slectFile  );
    
  }
  async uploadImage(file) : Promise<any> { 
    console.log("Name file ", file[0].name);
    console.log(" file ", file[0]);
    let ext = file[0].name.split('.').pop();
    console.log("Name file Extention ", ext);
    let id = new Date().toString(); 
    const task = await firebase.storage().ref('Profils').child(id).put(file[0]);
    
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
