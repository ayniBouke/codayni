import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Label } from '../models/Label';

import { config } from '../app.module';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  allData : Label[];
  haveData : boolean = false;
  getApiUrl : string = "http://192.168.1.240:1007/api/labels/"; //"https://jsonplaceholder.typicode.com/posts"; 
  constructor(private http : HttpClient) { }
  headers = new Headers(
    {
      "Authorization" : "Bearer " + localStorage.getItem("token"),
      "Content-Type" : "application/json"
    }
  );
  //a = localStorage.getItem("token");
  //headers.append("Authorization", "Bearer " + localStorage.getItem("token"));
  //headers.append("Content-Type", "application/json");

  getDetails() {
    //this.allData = this.http.get<any[]>(this.getApiUrl);
    return this.http.get(this.getApiUrl );
  }
  geTitle(title : string) {
    var listData = [];
    this.haveData = false;
    //this.allData = this.http.get<any[]>(this.getApiUrl);
    this.http.get(this.getApiUrl ).subscribe(
      data =>{
        var i = 0;
        console.log("Data service ", data);
        console.log("defaultValue data 0 ",data[0].defaultValue);
        while(data){
          console.log("defaultValue data 0 ",data[0].defaultValue);
          var defaultValue = data[i].defaultValue;
          console.log("defaultValue ",defaultValue);
          if(defaultValue.search(title) != -1){
            this.haveData = true;
            listData.push(data[i]) ;
          }
          i = i + 1 ;
        }
      }
    );
    this.allData = []
    this.allData = listData;
  }
  getDetail(id : number) {
    return this.http.get<Label>(this.getApiUrl + id );
  }
  addLabel(data : Label){ 
    console.log("Data service object : ", data);
    return this.http.post(config.serviceBase + 'api/labels/', data  );
  }

  delete(id : number) {
    return this.http.delete<Label>(this.getApiUrl + id );
  }
}
