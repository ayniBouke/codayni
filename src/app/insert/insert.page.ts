import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../services/service.service';
import { Label } from '../models/Label';
import { getLocaleNumberSymbol } from '@angular/common';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-insert',
  templateUrl: './insert.page.html',
  styleUrls: ['./insert.page.scss'],
})
export class InsertPage implements OnInit {

  tst: string = "Vide";
  label = new Label();
  id: any = -1;
  btn_txt: string;
  constructor(public serviceService: ServiceService,
    private router: Router, private navCtrl: NavController,
    private route: ActivatedRoute,
    private userService: UserService,
    private navController: NavController,
    private alertCtrl: AlertController
  ) {

  }

  ngOnInit() {
    this.route.params.subscribe(
      par => this.id = par.id
    );
    console.log("Id : ", this.id);

    if (this.id != -1) {
      this.btn_txt = "Update Label";
      this.serviceService.getDetail(this.id).subscribe(
        data => this.label = data
      );
      console.log("Yes");
    }
    else {
      this.btn_txt = "Add Label";
      console.log("Non");

    }
  }

  showAlert() {

    this.alertCtrl.create({
      header: 'Alert',
      //subHeader: 'Subtitle for alert',
      message: 'Have to connect!',
      buttons: ['oK']
    }).then(res => {

      res.present();

    });

  }

  ionViewDidEnter() {
    console.log("ionViewWillEnter");

  }
  //name = new FormControl('Dayana', Validators.required);
  //<ion-input type="text" formControlName="name"></ion-input>
  async logForm() {
    //this.label.id = 16;
    if (this.id == -1) {
      this.label.creationDate = new Date();
    }
    this.label.modificationDate = new Date();
    console.log(this.label);
    console.log(new Date());
    if (this.userService.isLogin) {
      await this.serviceService.addLabel(this.label).subscribe(
        (data : any) => {
          //this.serviceService.allData.push(data)
          this.serviceService.getDetails().subscribe(
            (data : Label[]) => this.serviceService.allData = data
          )
        }
      );
      this.navController.navigateRoot("details");
    }
    else {
      this.userService.fromIsert = "FromIsert";
      this.alertCtrl.create({
        header: 'Alert',
        //subHeader: 'Subtitle for alert',
        message: 'Have to connect!',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              this.router.navigate(["/login/"]);
            }
          }
        ]
      }).then(res => {

        res.present();

      });

    }
    this.label.code = "";
    this.label.defaultValue = "";

    //this.navCtrl.navigateRoot("details");
    // this.router.navigate(["/details/"])
  }
}
