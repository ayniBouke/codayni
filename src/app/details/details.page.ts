import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Label } from '../models/Label';
import { User } from '../models/User';
import { MediaService } from '../services/media.service';
//import { InsertPage } from '../insert/insert.page';
import { ServiceService } from '../services/service.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  
  DataLoaded = false;
  myInput ;
  myData ;
  imUser = "../../assets/images/userIm.png";

  constructor(private service: ServiceService, private router : Router, 
    private alertCtrl: AlertController, private userService : UserService,
    private mediaService : MediaService
    ) {
      console.log("this Constrctor details");
      
    //var x =this.btn.id;
    this.myData = this.service.allData;
    this.service.getDetails().subscribe(
      data => {
        this.service.haveData = true;
        //this.service.AddData = data as Label[];
        console.log("Cancel " , data);
        //this.router.navigate(['/details/']);
      }
    );

    this.userService.getUserByIdent(this.userService.identification).subscribe(
      (user : User) => {
        if(user.mediaServerId){
          this.mediaService.getMedia(user.mediaServerId).subscribe(
            media => this.imUser = media.link,
            err => console.log("Get url media err ", err )
          )
        }
      },
      err => console.log("User Get url media err ", err )
    );

  }
  
  //Refrech
  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
  //Test
  test(){
    this.router.navigate(['/test/']);
  }
  onCancel(){
    console.log("onCancel ^^^^^^^^^^^^^^ ");
    //this.myInput = ' ';
    
    //this.myData = this.service.allData;
    this.service.getDetails().subscribe(
      data => {
        //this.service.AddData = data as any;
        console.log("Cancel " , data);
        this.router.navigate(['/details/']);
      }
    );
  }
  onInput($event){
    // Reset items back to all of the items
    var val = $event.target.value;
    this.myInput = val;
    console.log('input ', val);
    console.log('input item ',  val.trim());
    this.service.geTitle(this.myInput);
  }

  showAlert(id : number) {

    this.alertCtrl.create({
      header: 'Alert',
      //subHeader: 'Subtitle for alert',
      message: 'Label have an Id : '+id +' are updeted.',
      buttons: ['oK']
    }).then(res => {

      res.present();

    });

  }

  ngOnInit() {
    this.service.getDetails().subscribe(
      ob => {
        this.service.allData = ob as [];
        this.DataLoaded = true;
       
      }
    );

    console.log(this.userService.isLogin);
    console.log("ngOnInit");
  }
  //show users
  showUsers(){
    this.router.navigate(["/users/"]);
  }

  goProfil(){
    this.router.navigate(["/profil/"]);
  }
  NewLabel() {
    this.router.navigate(["/insert/-1"]);
    console.log("New Label");
  }
  UpdateLabel(id : number) { 
    this.router.navigate(["/insert/" + id]);
    //this.route.navigate(["/details/"]);
    console.log("Label Updated");
    
  }
  DeleteLabel(id : number) { 
    this.alertCtrl.create({
      header: 'Alert Delete',
      //subHeader: 'Subtitle for alert',
      message: 'You are sur delete Label have Id : '+ id +' ?',
      buttons: [
        {
          text: 'Not Sure',
          handler: () => {
            this.router.navigate(["/details/"]);
          }
        },
        {
          text: 'Yes!',
          handler: () => {
             //this.showAlert(id);
            this.service.delete(id).subscribe(
              res => {
                let index=this.service.allData.findIndex(l=>l.id==id);
                if(index!=-1){
                  this.service.allData.splice(index,1);
                }
              },
              err => console.log(err)
            );
            this.router.navigate(["/details/"]);
            //this.route.navigate(["/details/"]);
            console.log("Label Deleted");
                  }
        }
      ]
    }).then(res => {

      res.present();

    });
  }

}
