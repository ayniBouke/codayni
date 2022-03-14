import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { config } from '../app.module';
import { User } from '../models/User';
import { UserServiceService } from './user-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  authentication = {
    isAuthenticated : true,
    userName : "",
    useRefreshTokens : "",
    token : ""
  }
  user : User;
  isLogin : boolean = false;
  fromIsert : string = "";
  verificationCode;
  userActiveted : boolean ;

  phoneNum : string;
  identification : string;
 

  constructor(private httpClient : HttpClient, private router : Router) { 
    console.log("User Tkn ============ ", localStorage.getItem('isLoggedIn'));
    
  }
  
  register(user : User){
    return this.httpClient.post(config.serviceBase + 'api/users/' , user);
  }
  update(user : any){
    return this.httpClient.post(config.serviceBase + 'api/users/update/' , user);
  }
  put(user : any){
    return this.httpClient.put(config.serviceBase + 'api/users/restPassword/' , user);
  }
  getUserByIdent(identifiant : string){
    return this.httpClient.get(config.serviceBase+'api/users/'+ identifiant)
  }
  activateUser(identifiant){
    this.getUserByIdent(identifiant).subscribe(
      (user : any)=>{
        console.log("update user :" , user);
        user.isActivated = true;
        this.update(user).subscribe(
          data => console.log("updated"),
          err => console.log("err update ", err)
          
          
        );
      }
    )
  }
  async login(login: string, password: string) {
    //this.getUser(login);
    console.log("login : " + login);
    console.log("password : " + password);
    console.log("config : " + config);

    this.getUserByIdent(login).subscribe(
      (user : any) => {
        if(!user.isActivated){
          this.router.navigate(['/confirm/'])
        }
      }
    );

    return new Promise((resolve, reject) => {
      console.log("----------------------------/////////// ", dataUser);
      
      var dataUser = 'grant_type=password'
        + '&username=' + login
        + '&password=' + password
        + '&client_id=' + config.clientId
        + '&client_secret=' + config.clientSecret;
      console.log('start login', dataUser);
      //httpClient
      this.httpClient.post(config.serviceBase + 'token', dataUser, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).subscribe((response) => {
        let userName = '';
        console.log('response login');
        console.log(response);
        userName = response["userName"];
        console.log(userName);
        this.authentication.isAuthenticated = true;
        this.authentication.userName = response["userName"];
        this.authentication.useRefreshTokens = response['refresh_token'];
        this.authentication.token = response['access_token'];
        console.log("_______________________Is authenticated : " + this.authentication.isAuthenticated + "__________________________");

        var headers = new Headers();
        headers.append("Authorization", "Bearer " + localStorage.getItem("token"));
        headers.append("Content-Type", "application/json");

        this.httpClient.get(config.serviceBase + 'api/users/' + userName ).subscribe((data) => {
          console.log('response find user');
          this.user = data as User;
          console.log(data);
          console.log('________________________________USER______________________________');
          console.log(this.user);

          //console.log("Firebase Token from user.service :", this.localFCMToken);
          //this.user.firebaseToken = this.localFCMToken;

          //this.setCurrentUser();
          //this.setCurrentAuth();
          localStorage.setItem('token',this.authentication.token);
          localStorage.setItem('isLoggedIn','TRUE');
          this.isLogin = true ;
          resolve(data);
          
        }, (err) => {
          console.log("Error details : ", err);
          //console.log(err.error.Message);
          reject(err);
          
        });
      }, (err) => {
        console.log("Error : ", err);
        reject(err);
        
      });

    });
  }
}
