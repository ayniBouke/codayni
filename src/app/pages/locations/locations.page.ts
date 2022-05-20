import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
})
export class LocationsPage implements OnInit {

  
 //public labelManagement: LabelManagement = new LabelManagement();

  lat: number = 18.079021;
  lng: number = -15.965662;
  height = 0;
  zoom: number = 12;
  //consultationsList: Consultation[] = [];
  constructor(public platform: Platform,
    //private userService: UserService,
    //public languageService: LanguageService,
    // public consultationService: ConsultationService,
    private navController: NavController
    ) {
    console.log(platform.height());
    this.height = platform.height() - 56;

    // this.getConsultationsList();
    // console.log("commingFromReservedConsultationsPage = ", this.consultationService.commingFromReservedConsultationsPage);
  }

  // async getConsultationsList(){
  //   if (this.consultationService.consultationsStatus) {
  //     await this.consultationService.getProviderConsultationsAPending(this.userService.user);
  //     this.consultationsList = this.consultationService.userConsultationsAPending;
  //     console.log("A pending, ",this.consultationsList);
  //   }
  //   else {
  //     await this.consultationService.getProviderConsultationsInProgress(this.userService.user);
  //     this.consultationsList = this.consultationService.userConsultationsInProgress;
  //     console.log("In progress, ",this.consultationsList);
  //   }
  // }

  // back() {
  //   if(this.consultationService.commingFromReservedConsultationsPage) this.navController.navigateBack("doctor-home/reserved-consultations");
  //   else this.navController.navigateBack("doctor-home/doctor-notifications");
  // }

  ngOnInit() {
  }

}
