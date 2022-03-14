import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '../app.module';
import { Media } from '../models/Media';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private http : HttpClient, private userService : UserService) { }

  getMedias() {
    //this.allData = this.http.get<any[]>(this.getApiUrl);
    return this.http.get(config.serviceBase + 'api/medias/');
  }
  
  getMedia(id : number) {
    return this.http.get<Media>(config.serviceBase +'api/medias/' + id );
  }
  //api/medias/add
  AddMedia(data : Media){ 
    console.log("AddData");
    
    this.http.post(config.serviceBase + 'api/medias/add', data  ).subscribe(
      (media : any) =>{
        console.log("Get media ", media) 
        this.userService.getUserByIdent(this.userService.identification).subscribe(
          (user : any) => {
            console.log("Get user  ", user) 
            user.mediaServerId = media.serverId;
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
}
