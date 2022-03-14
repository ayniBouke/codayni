import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ayni } from '../models/Ayni';

@Injectable({
  providedIn: 'root'
})
export class AyniServiceService {

  allDataAyni : Ayni[];
  
  getApiUrl : string = "http://192.168.1.240:1007/api/ayni/"; //"https://jsonplaceholder.typicode.com/posts"; 
  constructor(private http : HttpClient) { }
  
  getDetails() {
    //this.allData = this.http.get<any[]>(this.getApiUrl);
    return this.http.get(this.getApiUrl);
  }
  getDetail(id : number) {
    return this.http.get<Ayni>(this.getApiUrl + id);
  }
  AddData(data : any){ 
    console.log("AddData");
    
    this.http.post(this.getApiUrl, data).subscribe(data1=>{
      //this.allData.push(data1);
      this.getDetails().subscribe(
        data => this.allDataAyni = data as []
      )
      console.log(data1);
      
    },err=>{
      this.getDetails().subscribe(
        data => this.allDataAyni = data as []
      )
      console.log(err);
      
    })
  }

  delete(id : number) {
    return this.http.delete<Ayni>(this.getApiUrl + id);
  }
}
