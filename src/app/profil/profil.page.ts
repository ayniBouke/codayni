import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DetailsPage } from '../details/details.page';
import { User } from '../models/User';
import { MediaService } from '../services/media.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {

  myData : User = {serverId : null,
    firstName : '',
    lastName : '',
    identifiant : '',
    phone :  '',
    email : '',
    password :  '',
    //gpsLocation : Geolocation,
    creationDate : null,
    modificationDate : null,
    isActivated : false,
    settingServerId : 1,
    mediaServerId : 0,
    type: 0,
    userLoginType: 0
  };

  imUser;
  constructor(private serviceUser : UserService,  private router : Router, 
    private alertCtrl: AlertController,
    private mediaService : MediaService
    ) { }

  ngOnInit() {
    if(this.serviceUser.identification){
      var ident = this.serviceUser.identification;
      this.serviceUser.getUserByIdent(ident).subscribe(
        data => { 
          this.myData = data as User; 
        },
        err => console.log(err)
      )
      console.log("identification ", this.serviceUser.identification);
    }
    else{
      console.log(" No identification ");
    }

    //call  getLinkImg for get img url
    this.getLinkImg();
  }

  getLinkImg(){
    this.serviceUser.getUserByIdent(this.serviceUser.identification).subscribe(
      (user : User) => {
        if(user.mediaServerId){
          this.mediaService.getMedia(user.mediaServerId).subscribe(
            media => this.imUser = media.link,
            err => console.log("Get url media err ", err )
          )
        }
      },
      err => console.log("User Get url media err ", err )
    )
  }
  addImage(){
    this.router.navigate(['/test/'])
  }
  Update(){
    this.alertCtrl.create({
      header: 'Alert Update',
      //subHeader: 'Subtitle for alert',
      message: 'You are sur want update your profil ?',
      buttons: [
        {
          text: 'Not Sure',
          handler: () => {
            if(this.serviceUser.identification){
              var ident = this.serviceUser.identification;
              this.serviceUser.getUserByIdent(ident).subscribe(
                data => { 
                  this.myData = data as User; 
                },
                err => console.log(err)
              )
              console.log("identification ", this.serviceUser.identification);
            }
            else{
              console.log(" No identification ");
            }
            this.router.navigate(["/profil/"]);
          }
        },
        {
          text: 'Yes!',
          handler: () => {
            this.serviceUser.update(this.myData).subscribe(
              data => console.log("user updated " , this.myData),
              err => console.log("err update user  " , err )
            )
            this.router.navigate(["/details/"]);
            //this.route.navigate(["/details/"]);
            console.log("user updated");
          }
        }
      ]
    }).then(res => {

      res.present();

    });

    
    
  }
}
