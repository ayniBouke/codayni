import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AyniServiceService } from '../services/ayni-service.service';
import { UserService } from '../services/user.service';
//import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  message : string = "";
  loading : boolean = false;

  constructor(private authService : AyniServiceService, 
    private router : Router,
    private userService : UserService,
    //private storage: Storage
  ) { }

  form : any;
  ngOnInit() {
    var str = "hgfhtn"; 
    var a = str.search("fhk")
    console.log("eee" , a);

    console.log(this.userService.isLogin);
    
  }
  register(){
    this.router.navigate(['/register/']);
  }
  
  async login(form){
    this.loading = true;
    
    let userName = form.value["userName"];
    let pass = form.value["password"]; //"test" , "Hmd123"
    await this.userService.login(userName, pass).then(
      (value : any) =>{
        if(value){
          this.userService.identification = form.value["userName"];
          console.log("Value ", value.isActivated);
          //this.userService.userActiveted = value.isActivated;
          if (this.userService.fromIsert == "FromIsert"){
          this.router.navigate(['/insert/-1']);
          }
          else{
            this.router.navigate(['/details/']);
          }
          //alert('login success');
          console.log("IsLogin 1 ", this.userService.isLogin);
          
        }
        else{
          this.loading = false;
          this.message = "Password incorrect!";
          this.router.navigate(['/login/']);
         // alert('login fails');
          form.userName = "";
          form.password = "";
          console.log("IsLogin 2 ", this.userService.isLogin);
        }
      },
      err => {
        this.loading = false;
        console.log("IsLogin 3 ", this.userService.isLogin);
        //this.form.reset();
        form.userName = "";
        form.password = "";
        console.log(err);
      }
      
    )
  }

  connection (form){
    console.log("Form");
    
    this.authService.getDetail(form.value["Id"]).subscribe(
      res =>{
        console.log("Result : " ,res);
        if (res){
          this.router.navigate(['/details/']);
        }
        else{
          this.message = "Password incorrect!"
          this.router.navigate(['/login/']);
        }
    },
    err => console.log(err)
    
    );
  }
}
