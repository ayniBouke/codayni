import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mydashboard',
  templateUrl: './mydashboard.page.html',
  styleUrls: ['./mydashboard.page.scss'],
})
export class MydashboardPage implements OnInit {

  slideOpts = {
    initialSlide: 1,
    speed: 400,
    loop: true,
    autoplay: {
      delay: 4000,
      reverseDirection: true
    }
  };

  public iconcall = "iconcall";
  public call = "call";

  constructor() { }

  ngOnInit() {
  }

  toggle(){
    console.log("Toggled"); 
    if(this.iconcall == "iconcall"){
      this.iconcall = "iconcalled"
    }
    else{
      this.iconcall = "iconcall"
    }
    // this.iconcall = "iconcall"?"iconcalled":"iconcall";
    // this.call = "call"?"called":"call";
    if(this.call == "call"){
      this.call = "called"
    }
    else{
      this.call = "call"
    }
  }
}
